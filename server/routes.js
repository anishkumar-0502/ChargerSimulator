const express = require('express');
const { connectToOtherServer, closeWebSocket, findWebSocketByChargerId ,generateTransactionId,AcceptRemoteStartTransaction} = require('./WebSocket');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

// Flag to keep track of BootNotification status
let isBootNotificationSent = false;

//Connect to client server
router.post('/connect/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;

    try {
        // Call connectToOtherServer with the data to establish or reconnect WebSocket
        connectToOtherServer(data, ChargerID);
        res.status(200).json({ message: 'WebSocket connection established' });
    } catch (error) {
        console.error('Error establishing WebSocket connection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//send BootNotification
router.post('/BootNotification/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;

    try {
        if (!ChargerID) {
            // console.error('Charger ID not provided');
            return res.status(400).json({ message: 'Charger ID not provided' });
        }

        // else if(isBootNotificationSent === true) {
        //     // console.error('BoBootNotification already sent');
        //     return res.status(402).json({ message: 'BootNotification already sent' });
        // }else if(isBootNotificationSent === false) {
        //     connectToOtherServer(data, ChargerID);
        //     isBootNotificationSent = true;
        //     res.status(200).json({ message: 'BootNotification sent successfully' });
        // }
        connectToOtherServer(data, ChargerID);
        isBootNotificationSent = true;
        res.status(200).json({ message: 'BootNotification sent successfully' });
    } catch (error) {
        console.error('Error sending BootNotification message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//send statusNotification
router.post('/statusNotification/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;

    try {
        if (!ChargerID) {
            // console.error('Charger ID not provided');
            return res.status(400).json({ message: 'Charger ID not provided' });
        }

        connectToOtherServer(data, ChargerID);
        res.status(200).json({ message: 'BootNotification sent successfully' });
    } catch (error) {
        console.error('Error sending BootNotification message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//send StartTransaction
router.post('/StartTransaction/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;

    try {
        if (!ChargerID) {
            return res.status(400).json({ message: 'Charger ID not provided' });
        }

        connectToOtherServer(data, ChargerID);

        res.status(200).json({ message: 'StartTransaction sent successfully' });
    } catch (error) {
        console.error('Error sending StartTransaction message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//send StopTransaction
router.post('/StopTransaction/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;
    const transactionId = generateTransactionId();
    const StopTransaction = data[3].transactionId = transactionId ;
    try {
        if (!ChargerID) {
            return res.status(400).json({ message: 'Charger ID not provided' });
        }
        connectToOtherServer(data, ChargerID);
        res.status(200).json({ message: 'StartTransaction sent successfully',transactionId });
    } catch (error) {
        console.error('Error sending StartTransaction message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//send BootNotification
router.post('/MeterValues/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;
    const transactionId = generateTransactionId();
    const MeterValues = data[3].transactionId = transactionId ;

    try {
        if (!ChargerID) {
            // console.error('Charger ID not provided');
            return res.status(400).json({ message: 'Charger ID not provided' });
        }
        connectToOtherServer(data, ChargerID);
        res.status(200).json({ message: 'BootNotification sent successfully' });
    } catch (error) {
        console.error('Error sending BootNotification message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//send Remote StartTransition Status Accepted
router.post('/remoteStartTransitionStatusAccepted/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;
    try {
        if (!ChargerID) {
            // console.error('Charger ID not provided');
            return res.status(400).json({ message: 'Charger ID not provided' });
        }
        // Check if BootNotification is sent before allowing RemoteStartTransaction
        if (isBootNotificationSent === false) {
            // console.error('BootNotification not sent.');
            return res.status(401).json({ message: 'unsuccessful' });
        } 
            connectToOtherServer(data, ChargerID);
            res.status(200).json({ message: 'RemoteStartTransaction accept status message sent successfully' });

    } catch (error) {
        console.error('Error sending RemoteStartTransaction accept status message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//send Remote StartTransition Authorize
router.post('/remoteStartTransitionAuthorize/:id', async (req, res) => {
    const ChargerID = req.params.id;
    const data = req.body;
    try {
        if (!ChargerID) {
            // console.error('Charger ID not provided');
            return res.status(400).json({ message: 'Charger ID not provided' });
        }
        // Check if BootNotification is sent before allowing RemoteStartTransaction
        if (isBootNotificationSent === false) {
            // console.error('BootNotification not sent.');
            return res.status(401).json({ message: 'unsuccessful' });
        }
            connectToOtherServer(data, ChargerID);
            // console.error('RemoteStartTransaction authorization message sent successfully');
            res.status(200).json({ message: 'RemoteStartTransaction authorization message sent successfully' });

    } catch (error) {
        console.error('Error sending RemoteStartTransaction authorization message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Disconnect the websocket connection of client connected before
router.post('/disconnect', (req, res) => {
    try {
        const chargerId = req.body.chargerId;
        // Find the WebSocket connection based on chargerId
        const ws = findWebSocketByChargerId(chargerId);
        if (ws) {
            closeWebSocket(ws);
            console.log(`WebSocket for chargerId ${chargerId} disconnected`);
            res.status(200).json({ message: 'WebSocket disconnected' });
        } else {
            res.status(404).json({ message: 'WebSocket not found' });
        }
        // Reset BootNotification status on disconnection
        isBootNotificationSent = false;
    } catch (error) {
        console.error('Error handling WebSocket disconnection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
