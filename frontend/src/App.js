import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Import Redirect
import Home from './page/Home';

const App = () => {
 
  return (
    <Router>
        <Route exact  path="/" component={Home} />

    </Router>
  );
};

export default App;
