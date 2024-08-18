import dayjs,{ Dayjs } from "dayjs";
import { ReactNode, useState } from "react";
import { CalendarProps } from ".";
const cs = require('classnames');

interface MonthCalenderProps extends CalendarProps {
    selectHandler?: (date: Dayjs) => void,
    curMonth:Dayjs
}
interface Item {
    date: Dayjs,
    currentDate: boolean,
    
    // dateRender?:(currentDate:Dayjs)=>ReactNode,
    // value:Dayjs,
}
function getMonthInfo(date: Dayjs) {
    const daysInMonth = date.daysInMonth()
    const dayStart = date.startOf('month')
    const day = dayStart.day() //开始的是星期几

    // console.log(daysInMonth,dayStart,day);
    // console.log(dayStart.subtract(31,'day').format('YYYY-MM-DD'));


    const dayInfo: Item[] = new Array(6 * 7)

    for (let i = 0; i < day; i++) {
        dayInfo[i] = {
            date: dayStart.subtract(day - i, 'day'),
            currentDate: false
        }
    }

    for (let i = day; i < dayInfo.length; i++) {
        const calcDate = dayStart.add(i - day, 'day');
        dayInfo[i] = {
            date: calcDate,
            currentDate: calcDate.month() === date.month()
        }
    }
    console.log(dayInfo);

    return dayInfo

}


export const MonthCalender = (props: MonthCalenderProps) => {

    const {selectHandler} = props

    const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    // getMonthInfo(props.value)

    //获取要渲染这个的数组
    const dates = getMonthInfo(props.curMonth)

    const today = dayjs().format('YYYY-MM-DD');
   

    //双循环
    function renderDays(dates: Item[], value: Dayjs) {
        const rows = []
        for (let i = 0; i < 6; i++) {
            const row = []
            for (let j = 0; j < 7; j++) {
                const item = dates[i * 7 + j]
                row[j] = <div className={"calendar-month-body-cell " + (item.currentDate ? 'calendar-month-body-cell-current' : '')} >
                    {props.dateRender ? props.dateRender(item.date) :
                        (
                            <div className="calendar-month-body-cell-date" onClick={()=>{
                                console.log(item.date.date())
                                selectHandler?.(item.date)
                            }}>
                                <div className={cs('calendar-month-body-cell-date-value', value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD') ? 'calendar-month-body-cell-date-value-selected' : '',today === item.date.format('YYYY-MM-DD') ? 'calendar-month-body-cell-date-value-today' : '')}>
                                    {item.date.date()}
                                </div>
                                <div className="calendar-month-body-cell-date-content">{props.dateInnerContent?.(item.date)}</div>
                            </div>
                        )

                    }
                </div>
            }
            rows.push(row)
        }

        return rows.map((row, index) => <div className="calendar-month-body-row" key={index}>{row}</div>)
    }


    return (
        <div className="calendar-month">
            <div className="calendar-month-week">
                {
                    weekList.map((item, index) => {
                        return <div className="calendar-month-week-item" key={index}>
                            {
                                item
                            }
                        </div>
                    })
                }
            </div>

            <div className="calendar-month-body">
                {
                    renderDays(dates, props.value)
                }
            </div>
        </div>
    )
}