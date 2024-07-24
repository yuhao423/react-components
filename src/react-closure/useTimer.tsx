import { useEffect, useLayoutEffect, useRef } from "react"


//定时器的封装
export const useTimer = (fn:Function,time?:number)=>{


    const fnRef = useRef(fn)

    //组件挂载之前的时候,useLayoutEffect
    useLayoutEffect(()=>{
        fnRef.current = fn;
    })

    useEffect(()=>{

        const timer = setInterval(()=>{
            fnRef.current()
        },time || 0)

        return ()=>{
            clearInterval(timer)
        }
    },[])
}