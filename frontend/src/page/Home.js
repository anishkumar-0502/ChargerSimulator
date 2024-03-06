import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import Swal from 'sweetalert2';

// Global variables to store chargerId and status
let globalChargerId = "";
let globalStatus = "";
let transactionId;    
let currentEnergyValue = 50;

const Home = () => {
    // State variables to store the entered chargerId and status
    const [chargerId, setChargerId] = useState("");
    const [status, setStatus] = useState("");

    // Effect to load chargerId and status from localStorage on component mount
    useEffect(() => {
        const storedChargerId = localStorage.getItem("chargerId");
        const storedStatus = localStorage.getItem("status");

        if (storedChargerId) {
            setChargerId(storedChargerId);
            globalChargerId = storedChargerId;
        }

        if (storedStatus) {
            setStatus(storedStatus);
            globalStatus = storedStatus;
        }

    }, []);

    function RegError(Message) {
        Swal.fire({
            text: Message,
            icon: "error",
            customClass: {
                popup: 'swal-popup-center', // Center the entire popup
                icon: 'swal-icon-center',   // Center the icon within the popup
            },
        });
    }


    const connect = async (event) => {
        try {
            event.preventDefault(); // Prevent the form submission from reloading the page

            if (!chargerId) {
                console.error('Charger ID not provided');
                let setMessage = "Charger ID not provided.";
                RegError(setMessage);
                return;
            }

            // Use the stored chargerId value
            globalChargerId = chargerId;
            localStorage.setItem("chargerId", chargerId);

            const response = await axios.post(`/connect/${chargerId}`);
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    // sendBootMessage
    const sendBootMessage = async () => {
        try {
            // Use the stored globalChargerId value
            const BootMessage = [2, "a6gs8797ewYM01", "BootNotification", {
                "chargePointModel": "SingleSocketCharger",
                "chargePointVendor": "Outdid",
                "meterType": "Single Phase"
            }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/BootNotification/${chargerId}`, BootMessage);
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 402) {
                let setMessage = "BootNotification already sent";
                RegError(setMessage);
                return;
            }
        }
    };

    // Send Status Notification
    const statusNotification = async () => {
        try {
            // Use the stored globalCha
            const Status = globalStatus;
            const currentTimestamp = new Date().toISOString();

            const StatusNotification = [2, "a6gs8797ewYM06", "StatusNotification", {
                "connectorId": 1,
                "errorCode": "NoError",
                "info": "Working well",
                "status":Status ,
                "timestamp": currentTimestamp,
                "vendorId": "Outdid Tech",
                "vendorErrorCode": "200"
            }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/statusNotification/${chargerId}`, StatusNotification);
            console.log(response.data.message);
            // const transactionId =  response.data.transactionId

        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 402) {
                let setMessage = "statusNotification already sent";
                RegError(setMessage);
                return;
            }
        }
    };

    const statusNot = async (Status) => {
        try {
            const currentTimestamp = new Date().toISOString();

            // Use the stored globalCha
            const StatusNotification = [2, "a6gs8797ewYM06", "StatusNotification", {
                "connectorId": 1,
                "errorCode": "NoError",
                "info": "Working well",
                "status":Status ,
                "timestamp": currentTimestamp,
                "vendorId": "Outdid Tech",
                "vendorErrorCode": "200"
            }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/statusNotification/${chargerId}`, StatusNotification);
            console.log(response.data.message);
            // const transactionId =  response.data.transactionId

        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 402) {
                let setMessage = "statusNotification already sent";
                RegError(setMessage);
                return;
            }
        }
    };

    const StartTransaction = async () => {
        try {
            const currentTimestamp = new Date().toISOString();

            // Use the stored globalChargerId value
            const StartTransaction = [2, "a6gs8797ewYM05", "StartTransaction", {
                "connectorId": 1,
                "idTag": "BFAE390",
                "meterStart": 10,
                "reservationId": 1,
                "timestamp": currentTimestamp
            }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/StartTransaction/${chargerId}`, StartTransaction);
            console.log(response.data.message);
            
            console.log(response.data.transactionId);

            const Status = "Charging";
            statusNot(Status)
        } catch (error) {
            console.log(error);
        }
    };



    const StopTransaction = async () => {
        try {
            const currentTimestamp = new Date().toISOString();

            // Use the stored globalChargerId value
            const StopTransaction = [2, "a6gs8797ewYM07", "StopTransaction", { "idTag": "BFAE390", "meterStop": 0, "transactionId": transactionId , "timestamp": currentTimestamp, "reason": "PowerLoss" }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/StopTransaction/${chargerId}`, StopTransaction );
            const Status = "Finishing";
            statusNot(Status)
            currentEnergyValue = 50;

            console.log(response.data.message);

        } catch (error) {
            console.log(error);

        }
    };

    // Accept & Authorize
    
    const remoteStartTransitionStatusAccepted = async () => {
        try {
            const StatusAccepted = [3, "1695798668459", {
                "status": "Accepted"
            }];
            const chargerId = globalChargerId;
            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }
            const response = await axios.post(`/remoteStartTransitionStatusAccepted/${chargerId}`, StatusAccepted);
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                let setMessage = "Try sending BootNotification first! ";
                RegError(setMessage);
                return;
            } else if (error.response && error.response.status === 402) {
                let setMessage = "Remote StartTransition StatusAccepted already ";
                RegError(setMessage);
                return;
            }
        }
    };
    const remoteStartTransitionAuthorize = async () => {
        try {
            const Authorize = [2, "a6gs8797ewYM00", "Authorize", {
                "idTag": "BFAE390"
            }];
            const chargerId = globalChargerId;
            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }
            const response = await axios.post(`/remoteStartTransitionAuthorize/${chargerId}`, Authorize);
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                let setMessage = "Try sending BootNotification first! ";
                RegError(setMessage);
                return;
            } else if (error.response && error.response.status === 402) {
                let setMessage = "Try sending Remote StartTransition StatusAccepted first! ";
                RegError(setMessage);
                return;
            }
        }
    };

    // Meter Values
    const MeterValues = async () => {
        try {
            const currentTimestamp = new Date().toISOString();
            currentEnergyValue += 5;

            // Use the stored globalChargerId value
            const receivedMeterValues = [2, "a6gs8797ewYM04", "MeterValues", {
                connectorId: 1,
                transactionId: transactionId,
                meterValue: [{
                  timestamp: currentTimestamp,
                  sampledValue: [
                    { value: "240", context: "Trigger", format: "Raw", measurand: "Voltage", phase: "L1", unit: "V" },
                    { value: "15", context: "Sample.Periodic", format: "Raw", measurand: "Current.Import", phase: "L1", location: "Inlet", unit: "A" },
                    { value: "0.95", context: "Sample.Periodic", format: "Raw", measurand: "Power.Factor", phase: "L1", location: "Outlet" },
                    { value: "30", context: "Sample.Periodic", format: "Raw", measurand: "Power.Active.Import", phase: "L1", location: "Inlet", unit: "kW" },
                    { value:  currentEnergyValue , context: "Sample.Periodic", format: "Raw", measurand: "Energy.Active.Import.Register", phase: "L1", location: "Inlet", unit: "kWh" },
                    { value: "25", context: "Sample.Periodic", format: "Raw", measurand: "Temperature", phase: "L1", unit: "K" },
                    { value: "60", context: "Sample.Periodic", format: "Raw", measurand: "Frequency", location: "Inlet" },
                  ],
                }],
              }];
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Connection not established');
                let setMessage = "Connection not established";
                RegError(setMessage);
                return;
            }

            const response = await axios.post(`/MeterValues/${chargerId}`, receivedMeterValues);
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 402) {
                let setMessage = "MeterValues already sent";
                RegError(setMessage);
                return;
            }
        }
    };

    // disconnect
    const disconnect = async () => {
        try {
            // Use the stored globalChargerId value
            const chargerId = globalChargerId;

            if (!chargerId) {
                console.error('Charger ID not provided');
                return;
            }

            const response = await axios.post(`/disconnect`, { chargerId });
            console.log(response.data.message);

            // Clear chargerId after successful disconnection
            globalChargerId = "";
            globalStatus = "";
            localStorage.removeItem("chargerId");
            localStorage.removeItem("status");
        } catch (error) {
            console.log(error);
        }
    };

    // Handler to update the chargerId state when input changes
    const handleChargerIdChange = (event) => {
        setChargerId(event.target.value);
    };

    // Handler to update the status state when input changes
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        globalStatus = event.target.value;
        localStorage.setItem("status", event.target.value);
    };
    const statusOptions = ["Available", "Preparing", "Authorize", "Charging", "Finishing"];

    return (
        <div className="container-scroller">
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="content-wrapper d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-lg-4 mx-auto">
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <h3 className="text-primary"><b>Charger Simulator</b></h3>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="ChargerID"
                                        id="chargerId"
                                        value={chargerId}
                                        onChange={handleChargerIdChange}
                                        required
                                    />
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-success btn-lg font-weight-medium auth-form-btn" onClick={connect} type="submit">CONNECT</button>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={sendBootMessage} type="submit">SEND BOOT MESSAGE</button>
                                </div>
                                <h3 className="text-primary mt-4"><b>Send Status Notification</b></h3>
                                <div className="form-group mt-4">
                                    {/* Select field for status with options */}
                                    <select
                                        className="form-control form-control-lg"
                                        id="status"
                                        value={status}
                                        onChange={handleStatusChange}
                                        required
                                    >
                                        <option value="" disabled>Select Status</option>
                                        {statusOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-warning btn-lg font-weight-medium auth-form-btn" onClick={statusNotification} type="submit">STATUS NOTIFICATION</button>
                                </div>
                                <h3 className="text-primary mt-4"><b>After Remote Start</b></h3>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-info btn-lg font-weight-medium auth-form-btn" onClick={remoteStartTransitionStatusAccepted} type="submit">REMOTE START ACCEPT STATUS</button>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-dark btn-lg font-weight-medium auth-form-btn" onClick={remoteStartTransitionAuthorize} type="submit">REMOTE START AUTHORIZE</button>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-success btn-lg font-weight-medium auth-form-btn" onClick={StartTransaction} type="submit">START TRANSACTION</button>
                                </div>
                                <h3 className="text-primary mt-4"><b>Meter Values</b></h3>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-secondary btn-lg font-weight-medium auth-form-btn" onClick={MeterValues} type="submit">METER VALUES </button>
                                </div>
                                <h3 className="text-primary mt-4"><b>After Remote Stop</b></h3>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-info btn-lg font-weight-medium auth-form-btn" onClick={remoteStartTransitionStatusAccepted} type="submit">REMOTE START ACCEPT STATUS</button>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-dark btn-lg font-weight-medium auth-form-btn" onClick={remoteStartTransitionAuthorize} type="submit">REMOTE START AUTHORIZE</button>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-danger btn-lg font-weight-medium auth-form-btn" onClick={StopTransaction} type="submit">STOP TRANSACTION</button>
                                </div>
                                <h3 className="text-primary mt-4"><b>Disconnect</b></h3>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-danger btn-lg font-weight-medium auth-form-btn" onClick={disconnect} type="submit">DISCONNECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
