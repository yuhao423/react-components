import {useEffect, useRef, useState} from 'react'
import { useTimer } from './useTimer'

//react 闭包原因及处理办法
export default function Closure(){
        const [count,setCount] = useState(0)

        console.log('32333');
        
        //写一个函数来改变状态
        const update = ()=>{
                setCount(count + 1)
        }

        useEffect(()=>{
                setTimeout(()=>{
                        setCount((count)=>count +1)
                },1000)
                console.log('sssbb');
                
        },[])
        // useTimer(update,1000)

        return <div>{count}</div>
}   