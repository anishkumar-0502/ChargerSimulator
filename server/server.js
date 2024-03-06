const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const router = require('./routes');
const { connectToOtherServer, closeWebSocket } = require('./WebSocket');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();

app.use('/', router);
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Connection opened and ready to connect');

    ws.on('message', (data) => {
        try {
            const BootNotification = JSON.parse(data);
            console.log(`Received BootNotification: ${data}`);
            // Check if the other server WebSocket is open and send the message
            connectToOtherServer(BootNotification);
            // Broadcast the message to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(BootNotification);
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        closeWebSocket();
    });

});



const HTTP_PORT = process.env.HTTP_PORT || 3000;
server.listen(HTTP_PORT, () => {
    console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});
