require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose'),
    socketio = require('socket.io'),
    helmet = require('helmet'),
    hpp = require('hpp'),
    path = require('path');

const port = process.env.PORT || 8080;

const User = require('./models/User');
const socketMain = require('./sockets/socketMain');


let app = express();
app.use(express.json({limit: '50mb'}));
app.use(helmet({contentSecurityPolicy: false}));
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         "default-src": ["'self'"],
//         "connect-src": ["'self'", "'unsafe-inline'"],
//         "img-src": ["'self'", "data:"],
//     }
// }));
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

const server = app.listen(port, process.env.IP, () => {
    console.log(`Listening in port ${port}...`)
});

// Socket init
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Use API routes
const userRoutes = require('./routes/api/user'),
    authRoutes = require('./routes/api/auth'),
    messengerRoutes = require('./routes/api/messenger')(io);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/messenger', messengerRoutes);

// Don't expose our internal server to the outside world.
// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

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

