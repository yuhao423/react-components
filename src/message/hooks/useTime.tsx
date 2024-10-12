import { useEffect, useRef, useState } from "react";


/**
 * 
 * @param n 
 * @returns 
 * 
 * 面试题 手写 hooks 倒计时，支持暂停，reset
 */


export function useTime(n:number = 10){
    const [isStart,setIsStart] = useState<boolean>(false)
    const [time,setTime] = useState<number>(n) // n 和 ()=>n 的区别
    const timeRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(()=>{
        if(isStart && time > 0){
            timeRef.current = setTimeout(()=>{
                setTime(prev=>prev - 1)
            },1000)
        }else{
            //这里为什么要清除？
            if(!isStart && timeRef.current){
                clearTimeout(timeRef.current)
            }
        }
        return ()=>{
            if(timeRef.current){
                clearTimeout(timeRef.current)
            }
        }
    },[time,isStart])



    function start(){
        setIsStart(true)
    }

    function stop(){
        setIsStart(false)
    }

    function reset(){
        setIsStart(false)
        setTime(n)
    }

    return {
        start,stop,reset
    }
}


// 