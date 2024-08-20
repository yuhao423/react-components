
import { useEffect, useMemo, useRef, useState } from 'react'
import './index.scss'


export interface WaterFallProps {
    cloumn?: number,
    gap?: number,
    //触底距离多久加载
    bottom?:number | string,

    pageSize?:number,
    request:(page:number,pageSize:number)=>Promise<ICardItem[]>
}


//每一个卡片的props

export interface ICardItem{
    id:string,
    width:number,
    height:number,
    url:string,

    [key:string]:any
}


//单个卡片的位置信息，及样式
export interface ICardPositon {
    x:number,
    y:number,
    width:number,
    height:number
}



export const WaterFall = (props:WaterFallProps) => {

    const {
        cloumn = 2,
        gap = 10 ,
        bottom = 10,
        pageSize = 1,
        request
    } = props

    const containerRef = useRef<HTMLDivElement | null> (null)

    const [waterfallState,setWaterfallState] = useState({
            is_finished:false,
            page:1,
            //每个卡片的宽度
            carWith:0,
            carList:[] as ICardItem[],
            carPosition:[] as ICardPositon[],
            cloumnHeight:new Array(cloumn).fill(0) as number[]
    // }
    })
    const fetchData = async (page:number,pageSize:number)=>{
        //是否还有数据
        if(waterfallState.is_finished) return 

        const data = await request(page,pageSize)
        console.log(data,'data');
        
        const carWidth = getCarWidth() as number
        console.log(carWidth,'carWidth');
        
        let nextPage = waterfallState.page
        nextPage++;

        if(!data.length){
            console.log('我执行了吗？');  
            // waterfallState.is_finished = true
            return 

        }
       const {newPostion,newCloumnHeight} = computedCardPos(data,carWidth)
        //获取数据，获取后端返回的数据
        setWaterfallState((prev)=>{
            return {
                ...prev,
                page:nextPage,
                carWith:carWidth,
                carList:[...prev.carList,...data],
                carPosition:newPostion,
                cloumnHeight:newCloumnHeight
            }
        })
        // console.log(waterfallState,'waterfallStatewaterfallState');
        //最重要的地方，根据请求的数据计算卡片位置
        // setTimeout(()=>{
        //     computedCardPos(data)
        // },1000)
        
        // computedCardPos(data)
    }

    //根据请求的数据计算卡片位置
    const computedCardPos = (list:ICardItem[],carWith:number)=>{
        console.log(list,'list');
        let newCloumnHeight = [...waterfallState.cloumnHeight]
        let newPostion = [...waterfallState.carPosition]
        list.forEach((item,index)=>{
            //计算高度
            console.log(item.height,item.width ,carWith,'sb');
            
            const cardHeight = Math.floor((item.height * carWith  ) / item.width)
            if(index < cloumn){
                console.log('我进来了吗',cardHeight);
                
                //记录瀑布流每一列的高度
                //vue 的写法： waterfallState.cloumnHeight[index] = cardHeight + gap

                newCloumnHeight[index] = cardHeight + gap

                console.log(newCloumnHeight,'newCloumnHeight');
                // const postion = [...waterfallState.carPosition]
                newPostion.push({
                    width:carWith,
                    // width:382,
                    height:cardHeight,
                    // x:index ? index * (waterfallState.carWith + gap) : 0,
                    x:index ? index * (carWith + gap) : 0,
                    y:0
                })
                console.log(newPostion,'newPostion');
                
               
                // console.log(waterfallState,'waterfallState');
                
            }else{

                const {minIndex,minHeight} = minColunmHeight
                console.log(minIndex,minHeight,'ok');
                
                // newCloumnHeight = [...waterfallState.cloumnHeight]

                newCloumnHeight[index] = newCloumnHeight[index] + cardHeight + gap

                newPostion.push({
                    width:carWith,
                    height:cardHeight,
                    x:minIndex ? minIndex * (carWith + gap) : 0,
                    y:minHeight
                })

                // setWaterfallState((prev)=>{
                //    return {
                //     ...prev,
                //     //有点难度
                //     carPosition:[...prev.carPosition,{
                //         width:prev.carWith,
                //         height:cardHeight,
                //         x: minIndex ? minIndex * (prev.carWith + gap) : 0,
                //         y:minHeight
                //     }],
                //     cloumnHeight:newCloumnHeight
                //    }
                // })

            }

        })
             return {
                newPostion,
                newCloumnHeight
            }
    }

    //计算最小列高度

    const minColunmHeight = useMemo(()=>{
        let minIndex = -1
        let minHeight = Infinity

        //循环找到最小的 index 和 高度
        waterfallState.cloumnHeight.forEach((item,index)=>{
            if(item < minHeight){
                minIndex = index
                minHeight = item
            }
        })

        console.log(minIndex,minHeight,'yuyusbsb');
        
            return {
                minIndex,
                minHeight

            }        
    },[waterfallState.cloumnHeight])

    const getCarWidth = ()=>{
        const clientWidth = containerRef.current?.clientWidth
        console.log(clientWidth);
        
        if(clientWidth){
            //每一个卡片的宽度
            const carWith = (  clientWidth - (  gap *  cloumn! - 1 ) ) / cloumn

            console.log(carWith);
            return carWith
        }

    }


    const init = ()=>{
   
        fetchData(1,10)
        
    }
    // const a = (fn,time)=>{
    //     let timer: any = null

    //     return function (...arg: any){
    //         if(timer){
    //             return 
    //         }
    //         let ctx = this
    //         timer = setInterval(()=>{
    //             fn.apply(ctx,arg)
    //             timer  = null
    //         },time || 0)

            
    //     }
    // }

    useEffect(()=>{
        init()
    },[])

    // useEffect(()=>{
    //     if (waterfallState.carList.length > 0) {
    //         console.log('uyyuyuuy');
            
    //         computedCardPos(waterfallState.carList);
    //     }
    // },[waterfallState.carList])

    return (
        <div className="yu-waterfall-wrapper">
            <div className="yu-waterfall-container" ref={containerRef}>
                <div className="yu-waterfall-list">
                    {waterfallState.carList.map((item,index)=>{
                        console.log(item,index,waterfallState.carPosition[index].width,'weuhrfe');
                        return (
                            <div key={item.id} className="yu-waterfall-item" style={{width:`${waterfallState.carPosition[index].width}px`,height:`${waterfallState.carPosition[index].height}px`,transform: `translate3d(${waterfallState.carPosition[index].x}px, ${waterfallState.carPosition[index].y}px, 0)`}}>{item.url}</div>
                            // <div key={item.id}>{}</div>
                        )
                    })}
                    {/* <div className="yu-waterfall-item"></div> */}
                </div>
            </div>
        </div>
    )

}