import './index.scss';
import { MonthCalender } from './MonthCalender';
import {Dayjs} from 'dayjs'
import Header from './MonthHeader';

export interface CalendarProps{
    value:Dayjs
}

function Calendar(props:CalendarProps) {
    return <div className="calendar">
        <Header></Header>
        <MonthCalender {...props}></MonthCalender>
    </div>
}

export default Calendar;
