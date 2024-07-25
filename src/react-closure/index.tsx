import {useCallback, useEffect, useRef, useState} from 'react'
import { useTimer } from './useTimer'

//react 闭包原因及处理办法
export default function Closure(){
        const [count,setCount] = useState(0)

        console.log('32333');
        
        //写一个函数来改变状态
        const update = ()=>{
                setCount(count + 1)
        }

        const clearFn =  useTimer(update,1000)

        return (
                <>
                <div>{count}</div>
                <button onClick={()=>clearFn()}>停止计时</button>
                </>
        )
}   