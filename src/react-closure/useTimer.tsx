import { useCallback, useEffect, useLayoutEffect, useRef } from "react"


//定时器的封装
/**
 * 
 * @param fn 
 * @param time
 * 
 * 核心原理就是每一次改变状态的时候，将最新的函数赋值给ref，再执行来更改 ！！！
 */
export const useTimer = (fn:Function,time?:number)=>{


    const fnRef = useRef(fn)

    //停止的函数
    const clearFnRef = useRef<Function>()

    //组件挂载之前的时候,useLayoutEffect
    useLayoutEffect(()=>{
        console.log('我执行了');
        
        //将最新的更改状态的函数赋值给ref，这里切记不能加依赖项啊
        fnRef.current = fn;
    })

    //再加一个停止函数，暴露给外面，为什么要用 uesCallback ？
    const clearFn = useCallback(()=>{
        clearFnRef.current?.()
    },[])


    useEffect(()=>{

        const timer = setInterval(()=>{
            fnRef.current()
        },time || 0)

        clearFnRef.current = ()=>{
            clearInterval(timer)
        }

        return ()=>{
            clearFn()
        }
    },[])


    return clearFn
}