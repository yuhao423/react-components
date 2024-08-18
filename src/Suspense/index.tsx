import { lazy, Suspense } from "react"

const LazyAaa = lazy(()=> import('./Aaa'))

//import('./Aaa)  webpack 帮我们干的 动态加载这个模块
let data: any,promise;
function fetchData(){
    if(data) return data

    promise = new Promise<any>((resolve,reject)=>{
        setTimeout(()=>{
            data = '去到的数据'
            resolve(data)
        },2000)
    })

    throw promise
}


function Connect(){
    const data = fetchData()
    console.log(data);
    
    return <p>{data}</p>
}



export const SuspenseTest = ()=>{

   return (
    <Suspense fallback={'load...'}>
        {/* <LazyAaa></LazyAaa> */}
        <Connect></Connect>
    </Suspense>
   )
}