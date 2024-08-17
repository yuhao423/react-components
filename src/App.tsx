import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import {MessageProvider} from './message/index'
import ConfigProdiver from './message/ConfigProdiver';
import Closure from './react-closure';
import Calendar from './Calender';
import dayjs from 'dayjs';
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

    {/* <Closure></Closure> */}


    <Calendar value={dayjs('2024-08-17')}></Calendar>
    </>
  );
}

export default App;
