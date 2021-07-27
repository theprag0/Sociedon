require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose'),
    socketio = require('socket.io'),
    session = require('cookie-session'),
    helmet = require('helmet'),
    hpp = require('hpp'),
    // csurf = require('csurf'),
    net = require('net'),
    cluster = require('cluster');

const num_processes = require('os').cpus().length;
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');
const port = process.env.PORT || 8080;

const Online = require('./models/Online');
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
    app.use(express.json());
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

    // Cookie Configs
    // app.use(
    //     session({
    //         name: 'session',
    //         secret: process.env.SESSION_SECRET,
    //         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    //     })
    // );
    // app.use(csurf());

    // Don't expose our internal server to the outside world.
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
        // Check for existing connection
        const existingOnlineUser = await Online.findOne({user: userId});
        if(existingOnlineUser) {
            await Online.findOneAndUpdate({user: userId}, {
                $push: {
                    socketId: socket.id
                }
            });
        } else {
            const newOnlineUser = new Online({
                user: userId,
                status: 'online',
                socketId: socket.id
            });
            await newOnlineUser.save();
        }

        socketMain(io,socket);
        console.log(`connected to worker: ${cluster.worker.id}`);
        socket.on('disconnect', async (reason) => {
            // Check if user has more than one connections
            const foundUser = await Online.findOne({user: userId});
            if(foundUser.socketId.length > 1) {
                const updatedArray = await Online.findOneAndUpdate({user: userId}, {
                    $pull: {socketId: socket.id} 
                });
            } else {
                await Online.deleteOne({
                    user: socket.handshake.query.userId
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

function addClientToMap(userName, socketId, onlineUsersMap){
    if (!onlineUsersMap.has(userName)) {
        //when user is joining first time
        onlineUsersMap.set(userName, new Set([socketId]));
    } else{
        //user had already joined from one client and now joining using another
        //client
        onlineUsersMap.get(userName).add(socketId);
    }
}

function removeClientFromMap(userName, socketId, onlineUsersMap){
    if (onlineUsersMap.has(userName)) {
        let userSocketIdSet = onlineUsersMap.get(userName);
        userSocketIdSet.delete(socketId);
        //if there are no clients for a user, remove that user from online
        list (map)
        if (userSocketIdSet.size ==0 ) {
            onlineUsersMap.delete(userName);
        }
    }
}