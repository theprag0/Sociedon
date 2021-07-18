require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose')
    socketio = require('socket.io'),
    session = require('cookie-session'),
    helmet = require('helmet'),
    hpp = require('hpp'),
    csurf = require('csurf'),
    http = require('http'),
    net = require('net'),
    cluster = require('cluster'),
    os = require('os');

const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');
const port = process.env.PORT || 8080;

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
    app.use(express.static(__dirname + '/public'));
    app.use(helmet());
    app.use(hpp());
    
    // Cookie Configs
    app.use(
        session({
            name: 'session',
            secret: process.env.SESSION_SECRET,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        })
    );
    app.use(csurf());

    // Don't expose our internal server to the outside world.
    const server = app.listen(0, 'localhost');
    // console.log("Worker listening...");    
    const io = socketio(server);

    io.adapter(io_redis({ host: 'localhost', port: 6379 }));

    io.on('connection', function(socket) {
        socketMain(io,socket);
        // console.log(`connected to worker: ${cluster.worker.id}`);
    });

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

