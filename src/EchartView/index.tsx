
import React, { useMemo, useRef } from 'react'
import classNames from 'classnames'
import { useSize } from 'ahooks'
export const html = (option: any = {}, size: { width?: number, height?: number } = {}) => {
  return /* html */`
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js" integrity="sha512-VdqgeoWrVJcsDXFlQEKqE5MyhaIgB9yXUVaiUa8DR2J4Lr1uWcFm+ZH/YnzV5WqgKf4GPyHQ64vVLgzqGIchyw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  </head>
  <style>
      * {
          padding:0px;
          margin:0px;
      }
      body {
          width:${size.width}px;
          height:${size.height}px;
          overflow:hidden;
      }
      #main {
          width: 100%;
          height:100%;
      }
  </style>
  <body>
      <div id="main"></div>
      <script type="text/javascript">
          const myChart = echarts.init(document.getElementById('main'));
          const option = ${typeof option === 'string' ? option : JSON.stringify(option)};
          myChart.setOption(option);
  </script>
  </body>
  </html>
  `
}

export interface EChartsViewProps extends React.HTMLAttributes<HTMLDivElement> {
  option: any,
  echartsStyle?: string,
  // childDom?: React.ReactNode
}
const EchartView:React.FC<EChartsViewProps> = (_props)=>{

  const {style,className,option,...props} = _props
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)

  const doc = useMemo(()=>{
    return html(option,size)
  },[size?.height,size?.width,option])
  
  return (
    <div className={classNames(className)} ref={ref} style={{...style}} {...props}>
      <iframe srcDoc={doc} style={{ width: '100%', height: '100%', outline: 'none', border: 'none' }}></iframe>
    </div>
  )
}


export default EchartView