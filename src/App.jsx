import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventSelection from './components/EventSelection';
import PhotoFrame from './components/PhotoFrame';

function App() {

  return (
   <Router>
      <Routes>
        <Route path="/" element={<EventSelection />} />
        <Route path="/photo-frame" element={<PhotoFrame />} />
      </Routes>
   </Router>
  );
}

export default App;
