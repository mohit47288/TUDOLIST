import React from 'react';
import './App.css';

import Login from './components/Login';
import SignUp from './components/SignUP';
import TodoList from './components/TudoList';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/TodoList" element={<TodoList/>}/>
         

        </Routes>
      </Router>
    </div>
  );
}

export default App;