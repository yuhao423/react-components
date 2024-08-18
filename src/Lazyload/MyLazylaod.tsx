import { CSSProperties, ReactNode,FC, useState, useRef, useEffect } from "react"
import cs from 'classnames'

interface MyLazylaodProps{
    classNames?:string | string[],
    style?:CSSProperties,
    placeHolder:ReactNode,
    offset?:number | string,
    width?:number | string,
    height?:number | string,
    
    //可见的回调函数
    onContentVisible?:()=>void,
    //slot的
    children:ReactNode
}


export const MyLazylaod:FC<MyLazylaodProps> = (props)=>{

    const {
        classNames = '',
        style,
        placeHolder,
        offset = 0,
        width,
        height,
        onContentVisible,
        children
    } = props
    
    const [visible,setVisible] = useState(false)
    const classnames = cs('lazyload-wrapper',classNames)

    //合并样式
    const styles = {height,width,...style}

    //ref1
    const containRef = useRef<HTMLDivElement>(null)
    //ref2
    const observerRef = useRef<IntersectionObserver>()

    //处理的函数
    function handler(entries:IntersectionObserverEntry[]){
        const [enery] = entries

        const {isIntersecting}  = enery

        if(isIntersecting){
            setVisible(true)
            onContentVisible?.()

            const node = containRef.current
            //一样的逻辑
            if(node){
                observerRef.current?.unobserve(node)
            }
        }
    }

    //监视dom变化 IntersectionObserver
    useEffect(()=>{
        const options = {
            //1. rootMargin:
            rootMargin:typeof offset === 'number' ? `${offset}px` : offset,
            thresholods:0
        }

       observerRef.current  = new IntersectionObserver(handler,options)

       const node = containRef.current


       //监听这个node节点,确保这个dom节点存在
       if(node instanceof HTMLElement){
        observerRef.current.observe(node)
       }

       return ()=>{
            if(node && node instanceof HTMLElement){
                observerRef.current?.unobserve(node)
            }
       }

    },[])


    return (
        <div className={classnames} style={styles} ref={containRef}>
            {visible ? children : placeHolder}
        </div>
    )
}