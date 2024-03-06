# Charger Simulator

Charger Simulator is a web application designed to simulate various functionalities of an electric vehicle (EV) charging station. It serves as a tool for testing and experimenting with different charging scenarios.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Connection Management:**
  - Connect to a charging station by providing a Charger ID.
  - Send Boot Notification to initialize the charging station.

- **Status Notifications:**
  - Send status notifications to simulate different states of the charging process (Available, Preparing, Authorize, Charging, Finishing).

- **Transaction Control:**
  - Start a charging transaction.
  - Stop an ongoing charging transaction.

- **Remote Start/Stop:**
  - Simulate remote start transitions such as Accept Status and Authorize.
  - Simulate remote stop transitions.

- **Meter Values:**
  - Send simulated meter values during the charging process.

- **Disconnection:**
  - Disconnect from the charging station.

## Technologies

- **React:** Front-end library for building user interfaces.
- **Node.js:** JavaScript runtime for server-side development.
- **Express:** Web framework for Node.js.
- **Axios:** HTTP client for making requests.
- **SweetAlert2:** Library for creating beautiful and responsive modals.

## Getting Started

To get started with the Charger Simulator Application, follow the steps below:

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/anishkumar-0502/ChargerSimulator.git
   cd ChargerSimulator

2. Install dependencies for both the Frontent and backend:
      ```bash
    cd frontend
    npm run custom-install
    cd server
    npm install  //if node_modules does not present in the backend directry

3. Run the application:
      ```bash
     # In the client directory
     npm start
     # In the server directory
     npm run dev
## Usage

  Access the application at http://localhost:4444 (or your specified port).
  Enter the Charger ID and click CONNECT to establish a connection.
  Use the provided buttons to simulate various charging scenarios.
  Monitor the console for messages and responses.

## Development

  To contribute to the development of the  Charger Simulator Application, follow these steps:
  Fork the repository.
  Create a new branch for your feature/bugfix: git checkout -b feature-name
  Make your changes and commit them: git commit -m 'Your message'
  Push the changes to your fork: git push origin feature-name
  Create a pull request to the main repository.


