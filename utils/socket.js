
const socketSetup = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    })
}

module.exports = socketSetup;
