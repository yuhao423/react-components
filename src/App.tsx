import React from 'react';
import logo from './logo.svg';
import './App.css';
import {MessageProvider} from './message/index'
function App() {
  return (
    <div>
      <MessageProvider></MessageProvider>
    </div>
  );
}

export default App;
