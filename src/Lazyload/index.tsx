
import React, { useEffect } from "react"
import LazyLoad from "react-lazyload"
import './index.css'
import { MyLazylaod } from "./MyLazylaod"
import img1 from './test1.png'
import img2 from './test2.png'
const LazyYu = React.lazy(()=>import('./Yu'))
export const ReactLazyLoad = ()=>{

    /**
     * 1. 可以监听多个
     * 2. threshold 是元素进入可视范围多少触发，0.5 就是 超过0.5 会触发回调
     */
   useEffect(()=>{
    const intersectionObserver = new IntersectionObserver(
        function (entries) {
            console.log('info:');
            entries.forEach(item => {
                console.log(item.target, item.intersectionRatio)
            })
        }, {
        threshold: [0.5,1]
    });
    
    intersectionObserver.observe( document.querySelector('#box1') as any);
    intersectionObserver.observe( document.querySelector('#box2') as any);
   },[])
    


    return (
        <div>
            {/* <LazyLoad placeholder={'23w2323'}>
            <lazyYu></lazyYu>
            </LazyLoad> */}
            <div id="box1">BOX111</div>
            <div id="box2">BOX222</div>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <p>xxxxxxxxx</p>
            <LazyLoad placeholder={<div>loading...</div>}>
                <img src={img1}/>
            </LazyLoad>
            <LazyLoad placeholder={<div>loading...</div>}>
                <img src={img2}></img>
            </LazyLoad>
             <LazyLoad placeholder={'23w2323'} offset={200}>
                <LazyYu></LazyYu>
            </LazyLoad>


            <MyLazylaod placeHolder={'sbsbsbsb'} onContentVisible={()=>{
                console.log('我执行了');
                
            }}>
                <div>wehfewifrer</div>
                <div>wehfewifrer</div>
            </MyLazylaod>
            
        </div>
    )
}