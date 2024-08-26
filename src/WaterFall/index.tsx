
import React from 'react'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import './index.scss'
import throttle from './utils/throttle'
import {calculateTextLines} from './utils/getTextLines'
export interface WaterFallProps {
    cloumn?: number,
    gap?: number,
    //触底距离多久加载
    bottom?: number | string,

    pageSize?: number,
    request: (page: number, pageSize: number) => Promise<ICardItem[]>,
    // children:ReactNode
    renderItem: (item: ICardItem, index: number,postion:any) => ReactNode
}


//每一个卡片的props

export interface ICardItem {
    id: string,
    width: number,
    height: number,
    url: string,
    title:string,
    [key: string]: any
}


//单个卡片的位置信息，及样式
export interface ICardPositon {
    x: number,
    y: number,
    width: number,
    imageHeight:number,
    totalHeight:number,
    height?: number
}



export const WaterFall = (props: WaterFallProps) => {

    const {
        cloumn = 2,
        gap = 10,
        bottom = 10,
        pageSize = 20,
        // children,
        renderItem,
        request
    } = props

    const containerRef = useRef<HTMLDivElement | null>(null)

    // const [loadingBottom,setLoadingBottom] =useState(false)
    const [waterfallState, setWaterfallState] = useState({
        is_finished: false,
        page: 1,
        //每个卡片的宽度
        carWith: 0,
        carList: [] as ICardItem[],
        carPosition: [] as ICardPositon[],
        //高度
        cloumnHeight: new Array(cloumn).fill(0) as number[],
        loadingBottom: false,
        // }
    })
    const fetchData = async () => {
        //是否还有数据

        // setLoadingBottom(true)


        if (waterfallState.is_finished) return
        // const {carWidth,clientWidth} = getCarWidth() as any

        //加入loading 
        if (waterfallState.page !== 1) {
            console.log('你什么意思？');

            // setWaterfallState((prev) => {
            //     return {
            //         ...prev,
            //         loadingBottom: true,
            //         // carWith:carWidth,
            //         carList: [...prev.carList, ...[{ id: 'loading', width: 200, height: 20, url: "loading" }]],
            //         carPosition: [...prev.carPosition, ...[{ width: 200, height: 20, x: containerRef.current?.clientWidth! / 2, y: Math.max(...prev.cloumnHeight) }]]
            //     }

            // })

            setWaterfallState((prev)=>{
                return {
                    ...prev,
                    loadingBottom:true
                }
            })
        }

        const data = await request(waterfallState.page, pageSize)
        console.log(data, waterfallState.page, 'data');

        // const carWidth = testGetCarWidth
        const carWidth = getCarWidth() as number
        console.log(carWidth, 'carWidth');

        let nextPage = waterfallState.page
        nextPage++;

        if (!data.length) {
            console.log('我执行了吗？');
            // waterfallState.is_finished = true
            return

        }

        // setLoadingBottom(false)
        setWaterfallState((prev)=>{
            return {
                ...prev,
                loadingBottom:false
            }
        })

        // const newData = [...waterfallState.carList, ...data]
        //获取行数，由于加入padding，需要减少carWidth
        const lines = calculateTextLinesS(data,carWidth - 20)
        const { newPostion, newCloumnHeight } = computedCardPos(data, carWidth,lines)
        //获取数据，获取后端返回的数据
        setWaterfallState((prev) => {
            return {
                ...prev,
                page: nextPage,
                carWith: carWidth,
                carList: [...prev.carList, ...data],
                carPosition: newPostion,
                cloumnHeight: newCloumnHeight
            }
        })
        // calculateTextLinesS()
    }

    //根据请求的数据计算卡片位置
    const computedCardPos = (list: ICardItem[], carWith: number,lines:number[]) => {
        console.log(list, 'list');
        let newCloumnHeight = [...waterfallState.cloumnHeight]


        let newPostion = [...waterfallState.carPosition]
        list.forEach((item, index) => {
            //计算高度
            console.log(item.height, item.width, carWith, 'sb');

            const cardHeight = Math.floor((item.height * carWith) / item.width)

            if (index < cloumn && waterfallState.carList.length < pageSize) {
                console.log('我进来了吗', cardHeight);

                console.log('Y______________________________________________________________________');


                //记录瀑布流每一列的高度
                //vue 的写法： waterfallState.cloumnHeight[index] = cardHeight + gap

                newCloumnHeight[index] = cardHeight + gap + lines[index] * 19 + 8 + 20 + 20 //最后的20 是padding 的20

                console.log(newCloumnHeight, 'newCloumnHeight');
               
                //改造：
                newPostion.push({
                    width:carWith,
                    imageHeight:cardHeight,
                    totalHeight:cardHeight + lines[index] * 19 + 8 + 20 + 20,
                    x:index ? index * (carWith + gap) : 0,
                    y:0,
                })
                // newPostion.push({
                //     width: carWith,
                //     // width:382,
                //     height: cardHeight,
                //     x: index ? index * (carWith + gap) : 0,
                //     y: 0
                // })
                console.log(newPostion, 'newPostion');

            } else {

                const { minHeight, minIndex } = testMinColunmHeight(newCloumnHeight)
                newCloumnHeight[minIndex] += cardHeight + gap + lines[index] * 19 + 8 + 20 + 20
                console.log(minHeight, minIndex, newCloumnHeight, cardHeight, '2323sffwef');

                // newPostion.push({
                //     width: carWith,
                //     height: cardHeight,
                //     x: minIndex ? minIndex * (carWith + gap) : 0,
                //     y: minHeight
                // })

                //加入title的：
                newPostion.push({
                    width: carWith,
                    imageHeight: cardHeight,
                    totalHeight:cardHeight + lines[index] * 19 + 8 + 20 + 20,
                    x: minIndex ? minIndex * (carWith + gap) : 0,
                    y: minHeight
                })
            }
        })
        return {
            newPostion,
            newCloumnHeight
        }
    }

    //计算最小列高度

    const minColunmHeight = useMemo(() => {
        let minIndex = -1
        let minHeight = Infinity

        //循环找到最小的 index 和 高度
        waterfallState.cloumnHeight.forEach((item, index) => {
            if (item < minHeight) {
                minIndex = index
                minHeight = item
            }
        })

        console.log(minIndex, minHeight, 'yuyusbsb');

        return {
            minIndex,
            minHeight

        }
    }, [waterfallState.cloumnHeight])

    const testMinColunmHeight = (cloumnHeight: any[]) => {
        console.log(cloumnHeight, 'cloumnHeightcloumnHeightcloumnHeight-cloumnHeight');

        let minIndex = -1
        let minHeight = Infinity

        //循环找到最小的 index 和 高度
        cloumnHeight.forEach((item, index) => {
            if (item < minHeight) {
                minIndex = index
                minHeight = item
            }
        })

        console.log(minIndex, minHeight, 'yuyusbsb');

        return {
            minIndex,
            minHeight

        }
    }

    // const testGetCarWidth = useMemo(()=>{
    //     const clientWidth = containerRef.current?.clientWidth
    //     console.log(clientWidth,'wei');

    //     if(clientWidth){
    //         //每一个卡片的宽度
    //         const carWith = (  clientWidth - (  gap *  cloumn! - 1 ) ) / cloumn

    //         console.log(carWith);
    //         return carWith
    //     }
    //     return 0
    // },[])

    const getCarWidth = () => {
        const clientWidth = containerRef.current?.clientWidth
        console.log(clientWidth);

        if (clientWidth) {
            //每一个卡片的宽度
            const carWith = (clientWidth - (gap * cloumn! - 1)) / cloumn

            console.log(carWith);
            return carWith
        }

        // return 0
    }




    const init = () => {

        fetchData()

    }



    const handleOnScroll = throttle(() => {
        console.log('3');
        const { scrollTop, clientHeight, scrollHeight } = containerRef.current!

        //触底的条件
        const bottomDis = scrollHeight - clientHeight - scrollTop

        if (bottomDis <= bottom  && !waterfallState.loadingBottom) {
            console.log('yu323****');

            fetchData()
        }

    },200)

    const calculateTextLinesS = (data:ICardItem[],carWidth:number)=>{
        const titles = data.map((item,index)=>item.title)
        const res = calculateTextLines(titles,14,19,carWidth)
        console.log(titles,res,'我最是傻狗');
        
        return res
    }

    useEffect(() => {
        init()
        
    }, [])

    // useEffect(()=>{
    //     if (waterfallState.carList.length > 0) {
    //         console.log('uyyuyuuy');

    //         computedCardPos(waterfallState.carList);
    //     }
    // },[waterfallState.carList])

    return (
        <div className="yu-waterfall-wrapper">
            <div className="yu-waterfall-container" ref={containerRef} onScroll={handleOnScroll}>
                <div className="yu-waterfall-list">
                    {waterfallState.carList.map((item,index)=>{

                        return (
                            <React.Fragment key={item.id} >
                            <div className="yu-waterfall-item" style={{width:`${waterfallState.carPosition[index]?.width}px`,height:`${waterfallState.carPosition[index]?.totalHeight}px`,transform: `translate3d(${waterfallState.carPosition[index]?.x}px, ${waterfallState.carPosition[index]?.y}px, 0)`}}>
                                {renderItem(item,index,waterfallState.carPosition[index])}

                               
                            </div>
                            
                            </React.Fragment>
                        )
                    })}
                    {waterfallState.loadingBottom && (
                        <div style={{width:'200px',height:`20px`,transform: `translate3d(${ containerRef.current?.clientWidth! / 2}px, ${Math.max(...waterfallState.cloumnHeight)}px, 0)`}}>loading...</div>
                    )}
                   
                    {/* <div className="yu-waterfall-item"></div> */}
                    {/* {loadingBottom  && waterfallState.page !== 1 ? <div style={{width:'200px',height:`20px`,transform: `translate3d(${ containerRef.current?.clientWidth! / 2}px, ${Math.max(...waterfallState.cloumnHeight)}px, 0)`}}>loading...</div> : ''} */}
                </div>
            </div>
        </div>
    )

}