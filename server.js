require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose'),
    socketio = require('socket.io'),
    helmet = require('helmet'),
    hpp = require('hpp'),
    path = require('path'),
    net = require('net'),
    cluster = require('cluster');

const num_processes = require('os').cpus().length;
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');
const port = process.env.PORT || 8080;

const User = require('./models/User');
const socketMain = require('./sockets/socketMain');

if (cluster.isMaster) {
    let workers = [];

    // Helper function for spawning worker at index 'i'.
    let spawn = function(i) {
        workers[i] = cluster.fork();

        // Optional: Restart worker on exit
        workers[i].on('exit', function(code, signal) {
            // console.log('respawning worker', i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    const worker_index = function(ip, len) {
        return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
    };

    const server = net.createServer({ pauseOnConnect: true }, (connection) =>{
        let worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    });
    server.listen(port, process.env.IP, () => {
        console.log(`Master listening on port ${port}`);
    });
} else {
    let app = express();
    app.use(express.json({limit: '50mb'}));
    app.use(helmet());
    app.use(hpp());
    
    // Mongo Connection
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to dB!'))
    .catch(e => console.log(e));

    // Don't expose our internal server to the outside world.
    // Serve static assets if in production
    if(process.env.NODE_ENV === 'production') {
        // Set static folder
        app.use(express.static(path.join(__dirname, 'client', 'build')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
        });
    }
    const server = app.listen(0, 'localhost');
    // console.log("Worker listening...");    
    const io = socketio(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
          }
    });

    io.adapter(io_redis({ host: 'localhost', port: 6379 }));

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;

        // Update status and socket id of current user
        await User.findByIdAndUpdate({_id: userId}, {
            status: 'online',
            $push: {socketId: socket.id}
        }, {new: true});

        // Emit notification to all online friends
        const currUserFriends = await User.findOne({_id: userId}, {friends: 1, username: 1}).populate('friends', 'status socketId');
        if(currUserFriends && currUserFriends.friends.length > 0) {
            const onlineFriends = currUserFriends.friends.filter(friend => friend.status === 'online');
            onlineFriends.forEach(friend => {
                friend.socketId.forEach(socket => {
                    io.to(socket).emit('newOnlineFriend', {_id: userId, username: currUserFriends.username});
                });
            });
        }

        socketMain(io, socket, userId);
        console.log(`connected to worker: ${cluster.worker.id}`);
        socket.on('disconnect', async (reason) => {            
            // Check if user has more than one connections
            console.log(`Disconnecting ${userId}...`);
            const foundUser = await User.findById({_id: userId}, {
                friends: 1, 
                socketId: 1, 
                status: 1
            },{new: true}).populate('friends', 'status socketId');
            let updateUser;
            if(foundUser && foundUser.socketId.length > 1) {
                updateUser = await User.findByIdAndUpdate({_id: userId}, {$pull: {socketId: socket.id}}, {new: true});
                console.log(`Disconnected ${userId}`);
            } else {
                updateUser = await User.findByIdAndUpdate({_id: userId}, {
                    status: 'offline', 
                    $pull: {socketId: socket.id}
                }, {new: true});
                console.log(`Disconnected ${userId}`);
            }

            // Emit notification to all online friends
            if(foundUser && foundUser.friends.length > 0 && updateUser.status === 'offline') {
                const onlineFriends = foundUser.friends.filter(friend => friend.status === 'online');
                onlineFriends.forEach(friend => {
                    friend.socketId.forEach(socket => {
                        io.to(socket).emit('newOfflineFriend', {_id: userId});
                    });
                });
            }

            socket.disconnect(true);
        });
    });
    
    // Use API routes
    const userRoutes = require('./routes/api/user'),
        authRoutes = require('./routes/api/auth'),
        messengerRoutes = require('./routes/api/messenger')(io);
    app.use('/api/user', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/messenger', messengerRoutes);

    // Listen to messages sent from the master. Ignore everything else.
    process.on('message', function(message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        // Emulate a connection event on the server by emitting the
        // event with the connection the master sent us.
        server.emit('connection', connection);

        connection.resume();
    });
}

