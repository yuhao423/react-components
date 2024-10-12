import {CSSProperties,useRef} from 'react'
import cs from 'classnames';
import './index.less'
interface GirdProps {
  className?:string | string[],
  column:number,
  style?:CSSProperties,
  data:DataItem[],
  gridItemStyle?:CSSProperties,
  iconStyle?:CSSProperties,
  titleStyle?:CSSProperties,
  countStyle?:CSSProperties,
  customGrid?:(index:number,item:DataItem)=>React.ReactNode

}

// type Data = DataItem[]

interface DataItem {
  icon?:string,
  title:string,
  countTitle:string,
  onClick:(index:number,data:{icon?:string,title:string,countTitle:string})=>void
}

//新增GridItemProps类型
interface GridItemProps{
  width:number,
  height:number,
  data:DataItem,
  index?:number,
  column?:number,
  iconStyle?:CSSProperties,
  titleStyle?:CSSProperties,
  countStyle?:CSSProperties,
  handleItemPress?:(index:number,data:{icon?:string,title:string,countTitle:string})=>void
}


const GridItem:React.FC<GridItemProps> = (props)=>{

  const {data,index,column,gridItemStyle,iconStyle,titleStyle,handleItemPress} = props
  const {icon,title,countTitle} = data
  return (
    <div className={'grid-item'} style={gridItemStyle}>
      <img src={icon} ></img>
    </div>
  )
}

export const Grid:React.FC<GirdProps> = (props)=>{

  const {style,data,className,customGrid,...otherProps} = props
  const classNames = cs('grid-wrapper',className) //合并className
  const containerRef = useRef<HTMLDivElement>(null)

  // useEffect(()=>{
  //   containerRef.current = 
  // },[])

  //处理每一个子组件的点击事件
  const handleItemPress = (index:number,data:{icon?:string,title:string,countTitle:string})=>{
    console.log(index,data,'handleItemPress')
        
    // props.data[index].onPress(index,data)
    props.data[index].onClick(index,data)
    }

    const items = customGrid ? data.map((item,index)=>{
      return customGrid(index,item)
    }) :
    data.map((item,index)=>{
      return <GridItem data={item} key={index} index={index} height={style.height!} width={style.width!} handleItemPress={handleItemPress} {...otherProps}></GridItem>
    })

  return (
    <div style={style} className={classNames} ref={containerRef}>
      {items}
    </div>
  )
}
