import { Dayjs } from "dayjs";
import { CalendarProps } from ".";


interface MonthCalenderProps extends CalendarProps {
    
}
interface Item {
    date:Dayjs,
    currentDate:boolean
}
function getMonthInfo(date:Dayjs){
        const daysInMonth = date.daysInMonth()
        const dayStart = date.startOf('month')
        const day = dayStart.day() //开始的是星期几

        // console.log(daysInMonth,dayStart,day);
        // console.log(dayStart.subtract(31,'day').format('YYYY-MM-DD'));
       

        const dayInfo:Item[] = new Array(6 * 7)

        for(let i = 0;i<day;i++){
            dayInfo[i] = {
                date: dayStart.subtract(day - i, 'day'),
                currentDate:false
            }
        }

        for(let i = day;i<dayInfo.length;i++){
            const calcDate = dayStart.add(i - day, 'day'); 
            dayInfo[i] = {
                date: calcDate,
                currentDate:calcDate.month() === date.month()
            }
        }
        console.log(dayInfo);
        
        return dayInfo
        
}


export const MonthCalender = (props:MonthCalenderProps)=>{
    
    const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    // getMonthInfo(props.value)
    const dates = getMonthInfo(props.value)

    //双循环
    function renderDays(dates:Item[]){
        const rows = []
        for(let i = 0;i<6;i++){
            const row = []
            for(let j = 0;j<7;j++){
                const item = dates[i * 7 + j]
                row[j] = <div className={"calendar-month-body-cell " + (item.currentDate ? 'calendar-month-body-cell-current' : '')} >{item.date.date()}</div>
            }
            rows.push(row)
        }

        return rows.map((row,index)=><div className="calendar-month-body-row" key={index}>{row}</div>)
    }


    return (
        <div className="calendar-month">
            <div className="calendar-month-week">
                {
                    weekList.map((item,index)=>{
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
                    renderDays(dates)
                }
            </div>
        </div>
    )
}