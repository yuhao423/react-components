import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { MessageProvider } from './message/index'
import ConfigProdiver from './message/ConfigProdiver';
import Closure from './react-closure';
import Calendar from './Calender';
import dayjs from 'dayjs';
import { SuspenseTest } from './Suspense';
import { ReactLazyLoad } from './Lazyload';
import { VisturalList } from './visturalList';
import { ICardItem, WaterFall } from './WaterFall';
import data1 from './WaterFall/config/data1.json'
import data2 from './WaterFall/config/data2.json'
import { WaterFooter } from './WaterFall/Footer';

function App() {

  // const messageContext = useContext(ConfigContext)

  const colorArr = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];

  const list1: ICardItem[] = data1.data.items.map((item, index) => {
    return {
      id: item.id,
      url: item.note_card.cover.url_pre,
      width: item.note_card.cover.width,
      height: item.note_card.cover.height,
      title:item.note_card.display_title,
      likeCount:item.note_card.interact_info.liked_count,
      avatar:item.note_card.user.avatar,
      nickname:item.note_card.user.nickname
    }
  })

  const list2: ICardItem[] = data2.data.items.map((item, index) => {
    return {
      id: item.id,
      url: item.note_card.cover.url_pre,
      width: item.note_card.cover.width,
      height: item.note_card.cover.height,
      title:item.note_card.display_title,
      likeCount:item.note_card.interact_info.liked_count,
      avatar:item.note_card.user.avatar,
      nickname:item.note_card.user.nickname
    }
  })

  console.log(list1, 'list1');

  const list = [...list1, ...list2]
  const request = (page: number, pageSize: number) => {
    return new Promise<ICardItem[]>((resolve, reject) => {
      setTimeout(() => {
        resolve(list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize))
      }, 2000)
    })

  }
  const onLoad = ()=>{

  }
  return (
    <>
      {/* <div>
     <ConfigProdiver>
      <MessageProvider></MessageProvider>
      <button onClick={()=>{}}>we</button>
     </ConfigProdiver>
    </div> */}

      {/* <Closure></Closure> */}


      {/* <Calendar value={dayjs('2024-08-17')} className='sbrebeb' style={{width:'600px'}}
      // dateRender={(value)=>{
      //   return <div>{value.format('DD/MM/YYYY')}</div>;
      // }}
      dateInnerContent={(value)=>{
        return <div style={{fontSize:'10px'}}>农历slot</div>
      }}

      onChange={(value)=>{
        // alert(value)
        console.log(value);
        
      }}
    ></Calendar> */}

      {/* <SuspenseTest></SuspenseTest> */}


      {/* <ReactLazyLoad></ReactLazyLoad> */}

      {/* <VisturalList></VisturalList> */}

      <WaterFall request={request} pageSize={10} cloumn={3} renderItem={(item,index,postion)=>{
        // colorArr[index % (colorArr.length - 1)]
        console.log(item,postion);
        
        return (
          <>
          <div style={{ background: '#f7f7f7', width: `${postion.width}px`, height: `${postion.imageHeight}px`, borderRadius: "10px" }} key={index}>
            {<>
              <img src={`https://picsum.photos/200/300?${index}`} style={{ width: `${postion.width}px`, height: `${postion.imageHeight}px`, borderRadius: '20px' }}></img>
              {/* <div>{item.url}</div> */}
            </>}
          </div>
          {/* <div>{item.title}</div> */}
          <WaterFooter {...item}></WaterFooter>
          </>
         
        )
      }}></WaterFall>
    </>
  );
}

export default App;
