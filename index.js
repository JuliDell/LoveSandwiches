const PythonShell = require('python-shell')['PythonShell'];
const static = require('node-static');
const http = require('http');
const fs = require('fs');

var static_serve = new(static.Server)('./static');

const server = http.createServer(function (req, res) {
    static_serve.serve(req, res);
})

const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log("Socket Connected");
    
    function run_python_script() {
        try {
            let pyshell = new PythonShell('run.py');

            socket.on('disconnect', () =>  {
                console.log("Socket Disconnected");
                try {
                    pyshell.kill();
                } catch (e) {
                    console.log('Cannot send any more to pyshell', e);
                }
            });

            socket.on('command_entered', (command) =>  {
                console.log("Socket Command: ", command);
                try {
                    pyshell.send(command);
                } catch (e) {
                    console.log('Cannot send any more to pyshell', e);
                }
            });

