const WebSocket = require('ws');

let otherServerWebSocket;
let heartbeatInterval;
let heartbeatSent = false;
let ChargerID;
let isConnected = false;
let id;
let transactionId;
let StartCharger = false;
let StopCharger = true;

// Map to store WebSocket connections and associated client information
const clients = new Map();

// Function to find WebSocket connection based on ChargerID
function findWebSocketByChargerId(chargerId) {
    return clients.get(chargerId) || null;
}
function generateTransactionId() {
    transactionId = transactionId;
    return transactionId;
  }
// Function to send the next data
function sendNextData() {
    if (isConnected) {
        const currentTimestamp = new Date().toISOString();

        const StatusNotification = [2, "a6gs8797ewYM06", "StatusNotification", {
            "connectorId": 1,
            "errorCode": "NoError",
            "info": "Working well",
            "status": "Available",
            "timestamp": currentTimestamp,
            "vendorId": "Outdid Tech",
            "vendorErrorCode": "200"
        }];
        console.log('Sending StatusNotification data...', StatusNotification);
        otherServerWebSocket.send(JSON.stringify(StatusNotification));
    }
}

// Function to send a Heartbeat
function sendHeartbeat() {
    if (isConnected) {
        const Heartbeat = [2, "a6gs8797ewYM03", "Heartbeat", {}];
        console.log('Sending Heartbeat data...', Heartbeat);
        otherServerWebSocket.send(JSON.stringify(Heartbeat));
    }
}

// Function to Accept RemoteStartTransaction
async function AcceptRemoteStartTransaction() {
    if (isConnected) {
        return new Promise((resolve) => {
            const AcceptRemoteStartTransaction = [3, id || "not received", { "status": "Accepted" }];
            console.log('Sending Acceptance data...', AcceptRemoteStartTransaction);
            otherServerWebSocket.send(JSON.stringify(AcceptRemoteStartTransaction));

            const Authorize = [2, "a6gs8797ewYM00", "Authorize", {
                "idTag": "BFAE390"
            }];
            console.log('Sending Authorization data...', Authorize);
            otherServerWebSocket.send(JSON.stringify(Authorize));

            resolve();
        });
    }
}

// Function to Accept RemoteStopTransaction
async function AcceptRemoteStopTransaction() {
    if (isConnected) {
        return new Promise((resolve) => {
            const AcceptRemoteStopTransaction = [3, id || "not received", { "status": "Accepted" }];
            console.log('Sending Acceptance data...', AcceptRemoteStopTransaction);
            otherServerWebSocket.send(JSON.stringify(AcceptRemoteStopTransaction));

            const Authorize = [2, "a6gs8797ewYM00", "Authorize", {
                "idTag": "BFAE390"
            }];
            console.log('Sending Authorization data...', Authorize);
            otherServerWebSocket.send(JSON.stringify(Authorize));

            resolve();
        });
    }
}

// Function to Accept RemoteStartTransaction
async function StartTransaction() {
    console.log(StartCharger,StopCharger);
    if (isConnected) {
        return new Promise((resolve) => {
            const StartTransaction = [2, "a6gs8797ewYM00", "StartTransaction", {
                "connectorId": 1,
                "idTag": "BFAE390",
                "meterStart": 10,
                "reservationId": 1,
                "timestamp": "2024-02-06T06:53:58Z"
            }];
            console.log('Sending StartTransaction data...', StartTransaction);
            otherServerWebSocket.send(JSON.stringify(StartTransaction));
            StartCharger = true;
            StopCharger = false;

            resolve();
        });
    }
}

// Function to Accept StopTransaction
async function StopTransaction() {
    if (isConnected) {
        return new Promise((resolve) => {
            const stopTransactionStatus = [2, "a6gs8797ewYM07", "StopTransaction", { "idTag": "BFAE390", "meterStop": 0, "transactionId": transactionId, "timestamp": "2024-02-06T06:54:32Z", "reason": "PowerLoss" }];
            console.log('Sending stopTransactionStatus data...', stopTransactionStatus);
            otherServerWebSocket.send(JSON.stringify(stopTransactionStatus));
            StartCharger = false;
            StopCharger = true;

            resolve();
        });
    }
}

// Function to send StatusNotification
async function StatusNotification(currentStatus) {
    if (isConnected) {
        return new Promise((resolve) => {
            const Status = [2, "a6gs8797ewYM06", "StatusNotification", {
                "connectorId": 1,
                "errorCode": "NoError",
                "info": "Working well",
                "status": currentStatus,
                "timestamp": "2024-02-06T06:51:54Z",
                "vendorId": "Outdid Tech",
                "vendorErrorCode": "200"
            }];
            console.log('Sending StatusNotification data...', Status);
            otherServerWebSocket.send(JSON.stringify(Status));

            resolve();
        });
    }
}

// Function to resend the BootNotification message
async function resendMessage() {
    if (isConnected) {
        return new Promise((resolve) => {
            console.log('Resending the BootNotification message');
            // Assuming bootNotificationData is a global variable storing the BootNotification data
            otherServerWebSocket.send(JSON.stringify(bootNotificationData));

            resolve();
        });
    }
}

// Function to run the loop
function runloop() {
    const loopIntervalId = setInterval(() => {
        sendHeartbeat();
        heartbeatSent = true;
    }, heartbeatInterval);
}

// Function to handle the parsed message
async function handleParsedMessage(parsedMessage) {
    if (parsedMessage && parsedMessage[0] === 3 && parsedMessage[2] && parsedMessage[2].status === 'Accepted') {
        sendNextData();
        heartbeatInterval = parseInt(parsedMessage[2].interval);
        heartbeatSent = false;
    } else if (parsedMessage && parsedMessage[0] === 3 && parsedMessage[1] === 'a6gs8797ewYM06' && !heartbeatSent) {
        runloop();
    } else if (parsedMessage && parsedMessage[2] && parsedMessage[2] === 'RemoteStartTransaction' && StartCharger === false && StopCharger === true) {
        id = parsedMessage[1];
        //await AcceptRemoteStartTransaction();
    } else if (parsedMessage && parsedMessage[0] === 3 && parsedMessage[2] && parsedMessage[2].idTagInfo) {
        // Check for the presence of transactionId
        if (parsedMessage[2].transactionId) {
            transactionId = parsedMessage[2].transactionId;
            console.log(transactionId);
            //console.log('Start - ',StartCharger,StopCharger);
        }
    } else if (parsedMessage && parsedMessage[2] && parsedMessage[2] === 'RemoteStopTransaction') {
        //await AcceptRemoteStopTransaction();
        if (parsedMessage[3] && parsedMessage[3].transactionId === transactionId) {
            console.log('Received RemoteStopTransaction with transactionId:', transactionId);
        } else {
            console.error('Missing transactionId in RemoteStopTransaction message ');
        }
    } else if (!heartbeatSent) {
        await resendMessage();
    }
}

// Function to establish WebSocket connection
function establishWebSocketConnection(data) {
    otherServerWebSocket = new WebSocket(`ws://192.168.1.70:8050/OCPPJ/${ChargerID}`, ['ocpp1.6'], {
        headers: {
            "Upgrade": "websocket",
            "Connection": "Upgrade",
            "Sec-WebSocket-Key": "o1lUeTEfR+tPqf+WjaqL9A==",
            "Sec-WebSocket-Version": "13",
            "Sec-WebSocket-Protocol": "ocpp1.6",
        },
    });

    // Store the WebSocket connection with ChargerID in the clients map
    clients.set(ChargerID, otherServerWebSocket);

    otherServerWebSocket.on('open', () => {
        console.log('WebSocket connection established with ChargerID:', ChargerID);
        isConnected = true;
    });

    otherServerWebSocket.on('message', async (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received from server:', parsedMessage);
            await handleParsedMessage(parsedMessage);
        } catch (error) {
            console.error('Error parsing message from other server:', error);
        }
    });

    otherServerWebSocket.on('close', () => {
        // closeWebSocket(otherServerWebSocket);
        console.log('Connection closed unexpectedly.');
        isConnected = false;
        // Reconnect after a delay (e.g., 1 second)
        // setTimeout(() => connectToOtherServer(data), 1000);
    });
}

// Function to handle connecting state
function handleConnectingState(data) {
    console.warn('WebSocket is still connecting (CONNECTING state)');
    setTimeout(() => connectToOtherServer(data), 1000); // Retry connection after 1 second
}

// Function to connect to the other server
function connectToOtherServer(data, id) {
    ChargerID = id || ChargerID;

    if (!otherServerWebSocket || otherServerWebSocket.readyState === WebSocket.CLOSED) {
        establishWebSocketConnection(data);
    } else if (otherServerWebSocket.readyState === WebSocket.OPEN) {
        otherServerWebSocket.send(JSON.stringify(data));
        console.log('Sending data to server:', data);
    } else if (otherServerWebSocket.readyState === WebSocket.CONNECTING) {
        handleConnectingState(data);
    }
}

// Function to close WebSocket connection
function closeWebSocket(ws) {
    if (ws) {
        console.log('Closing WebSocket connection');
        isConnected = false;
        clearInterval(heartbeatInterval); // Clear the heartbeat interval
        ws.close();
        ChargerID = null; // or set it to any appropriate value
    }
}

module.exports = {
    connectToOtherServer,
    closeWebSocket,
    findWebSocketByChargerId,
    AcceptRemoteStartTransaction,
    generateTransactionId
};
