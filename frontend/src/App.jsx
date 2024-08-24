import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MapComponent from './MapComponent.jsx';
import ArduinoSimulation from './ArduinoSimulation.jsx';
import DisplayBin from './DisplayBin.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/map">Map</Link>
            </li>
            <li>
              <Link to="/arduino">Arduino Simulation</Link>
            </li>
            <li>
              <Link to="/display-bin">Display Bin</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/map" element={<MapComponent />} />
          <Route path="/arduino" element={<ArduinoSimulation />} />
          <Route path="/display-bin" element={<DisplayBin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;