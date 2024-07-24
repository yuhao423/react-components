import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import {MessageProvider} from './message/index'
import ConfigProdiver from './message/ConfigProdiver';
import Closure from './react-closure';
function App() {

  // const messageContext = useContext(ConfigContext)
  return (
    <>
    {/* <div>
     <ConfigProdiver>
      <MessageProvider></MessageProvider>
      <button onClick={()=>{}}>we</button>
     </ConfigProdiver>
    </div> */}

    <Closure></Closure>
    </>
  );
}

export default App;
