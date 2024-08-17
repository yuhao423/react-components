import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

export const useTimer = (fn:Function,timer:number)=>{

    const fnRef = useRef<Function>(fn)

    //取消的ref
    const clearFnRef = useRef<Function>()


    //use
    useLayoutEffect(()=>{
        fnRef.current = fn
    })

    //取消
    const clearfn = useCallback(()=>{
        return clearFnRef.current?.()
    },[])


    useEffect(()=>{

       const time = setInterval(()=>{
        fnRef.current?.()
       },timer || 0)


       clearFnRef.current = ()=>{
            clearInterval(time)
       }

       return ()=>{
       
        clearfn()
       }
    },[])


    return clearfn
} 