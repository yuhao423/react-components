import { useEffect, useRef, useState } from "react";


/**
 * 
 * @param n 
 * @returns 
 * 
 * 面试题 手写 hooks 倒计时，支持暂停，reset
 */

export function useCountDown(n:number = 10){
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


//master go

export const sb = (arr: any[])=>{
    
    //[5,4,3,2,1] => [1,2,3,4,5]

    for(let i = 0;i<arr.length;i++){
        for(let j = i + 1;j<arr.length;j++){
            if(arr[i] > arr[j]){
                let temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }
    }
    // 原型 ui 测试 开发 交互 运营
    return arr
}

export const useMemoFormieds = (x)=>{
    
    
}