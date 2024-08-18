import './index.scss';
import { MonthCalender } from './MonthCalender';
import dayjs, {Dayjs} from 'dayjs'
import Header from './MonthHeader';
import { CSSProperties, ReactNode, useState } from 'react';
const cs = require('classnames');
export interface CalendarProps{
    value:Dayjs,
    style?:CSSProperties,
    className?:string | string[],
    //定制日期
    dateRender?:(currentDate:Dayjs)=>ReactNode,
    //定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
    dateInnerContent?:(currentDate:Dayjs)=>ReactNode,
    locale?:string,
    onChange?:(date:Dayjs)=>void
}

function Calendar(props:CalendarProps) {

    const {
        value,
        style,
        className,
        onChange
    }
     = props

    const [selecedValue,setSelecedValue] = useState(value)
    const [curMonth,setCurMonth] = useState<Dayjs>(value)
    const selectHandler = (date:Dayjs)=>{
        setSelecedValue(date)
        onChange?.(date)
    }

    const preMonthHandler = ()=>{
        setCurMonth((prev)=>prev.subtract(1,'month'))
    }

    const nextMonthHandler = ()=>{
        setCurMonth((prev)=>prev.add(1,'month'))
    }

    const todayHandler = ()=>{
        setCurMonth(dayjs())
    }

    const classNames = cs('calendar',className) //合并className

    return <div className={classNames} style={style}>
        <Header curMonth={curMonth} preMonthHandler={preMonthHandler} nextMonthHandler={nextMonthHandler} todayHandler={todayHandler}></Header>
        <MonthCalender {...props} value={selecedValue} curMonth={curMonth} selectHandler={selectHandler} ></MonthCalender>
    </div>
}

export default Calendar;
