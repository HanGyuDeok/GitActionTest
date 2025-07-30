import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // 이 부분 추가
import './App.css';
import Hello from './components/Hello.jsx';
import About from './pages/About.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hello />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;
