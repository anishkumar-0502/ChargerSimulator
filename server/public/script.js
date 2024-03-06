// const socket = new WebSocket('ws://localhost:3000');

const connect = async () => {
    try {
        const chargerId = parseInt(document.getElementById('chargerId').value, 10);

        // Establish WebSocket connection with chargerId in the header
        const response = await axios.post(`http://192.168.1.6:3000/connect/${chargerId}`);
    } catch (error) {
        console.log(error);
    }
};

const sendBootMessage = async () => {
    try {
        // Example BootNotification message
        const BootMessage = [2,"a6gs8797ewYM01","BootNotification",{"chargePointModel":"SingleSocketCharger","chargePointVendor":"Outdid","meterType":"Single Phase"}]

        const chargerId = parseInt(document.getElementById('chargerId').value, 10);

        // Send BootNotification message with chargerId in the header
        const response = await axios.post(`http://192.168.1.6:3000/BootNotification/${chargerId}`,BootMessage );
        // socket.send( BootMessage);
    } catch (error) {
        console.log(error);
    }
};

const disconnect = async () => {
    try {
        const chargerId = document.getElementById('chargerId').value;
        const response = await axios.post(`http://192.168.1.6:3000/disconnect`, { clientId: chargerId });
        console.log(response.data.message);
    } catch (error) {
        console.log(error);
    }
};