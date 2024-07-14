import { CSSProperties, FC, ReactNode, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { useStore } from "./hooks/useStore"
import useTimer from "./hooks/useTimer"

import './index.scss'

export interface MessageProps {
    id?: number,
    duration?: number,
    content: ReactNode | string,
    style?: CSSProperties,
    position?: Postion,
    className?: string | string[],
    //add
    remove?:(id:number)=>void
}


export type Postion = 'top' | 'bottom'


const MessageItem: FC<MessageProps> = (props) => {
    const { content,id,duration,remove } = props
    //
    const {onMouseEnter,onMouseLeave} = useTimer({id:props.id!,duration,remove:remove!})
    return <div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {content}
    </div>
}



export const MessageProvider: FC<{}> = (props) => {

    const { messageList, add, update, remove, removeAll } = useStore('top')
    //1. 定义接口
    //2. hooks 增删改
    //3. 辅助函数

    useEffect(() => {
        setTimeout(() => {
            add({ id: 10, content: <div>333</div> })
        }, 1000);
    }, [])

    const postions = Object.keys(messageList) as Postion[]

    console.log(postions);

   const messageWrapper = (
        <div className="message-wrapper ">
            {
                postions.map((direction) => {
                    return (
                        <TransitionGroup className={`message-wrapper-${direction}`} key={direction}>
                            {
                                messageList[direction].map(item => {
                                    return (
                                        <CSSTransition className="message" key={item.id} timeout={1000}>
                                            <MessageItem {...item} remove={remove}></MessageItem>
                                        </CSSTransition>
                                    )
                                })
                            }
                        </TransitionGroup>
                    )
                })
            }
        </div>
    )



    const dom = useMemo(()=>{
        const el = document.createElement('div');
        el.className = `wrapper`;

        document.body.appendChild(el)
        return el
    },[])

    return createPortal(messageWrapper, dom);
}

