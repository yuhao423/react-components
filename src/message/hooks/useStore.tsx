
import { useState } from 'react'
import {MessageProps,Postion} from '../index'
import { getId, getMessageIndex, getMessageListPostion } from '../utils/message'

// export type DefaultPostion = 'top'

export type MessagePropsList = {
    top:MessageProps[],
    bottom:MessageProps[]
}

export const initMessageList = {
    top:[],
    bottom:[]
}

// const defaultPostion = 'top'

export function useStore(defaultPostion:Postion = 'top' ){

    const [messageList,setMessageList] = useState<MessagePropsList>({...initMessageList})


    const add = (mesageProps:MessageProps)=>{
        //1.id判断
        const id = getId(mesageProps)
        //2.改变状态
        setMessageList((prev)=>{
           //
           if(mesageProps?.id){
            const position = getMessageListPostion(mesageProps.id,prev)
            if(position){
                return prev
            }
           }
            
           const postion = mesageProps.position || defaultPostion

            //判断位置
            const isTop = postion.includes('top')
           console.log(isTop,'sn');
           
            const message = isTop ?
            [{...mesageProps,id},...prev[postion] ?? []]
            :
            [...prev[postion] ?? [],{...mesageProps,id}]
            
            return {
                ...prev,
                [postion]:message
            }

           
        })

        return id
    }

    const update = (id:number,mesageProps:MessageProps)=>{
        if(!id) return
        setMessageList((prev)=>{
            const postion = getMessageListPostion(id,prev)
            const index = getMessageIndex(id,prev)
            const nextValue = {...prev}
            if(getMessageIndex(id,prev) !== -1 && postion){
               nextValue[postion][index] = {
                ...nextValue[postion][index],
                ...mesageProps
               }
            }

            return nextValue
        })


    }


    const remove = (id:number)=>{
        if(!id) return

        setMessageList((prev)=>{
            const postion = getMessageListPostion(id,prev)
            const index = getMessageIndex(id,prev)
            if( index !== -1 && postion){
                return {
                    ...prev,
                   [postion]:prev[postion].filter((item)=>item.id !== id)
                }
            }
            return prev
        })
    }

    const removeAll = ()=>{

        setMessageList({...initMessageList})
    }


    return {
        messageList,
        add,
        update,
        remove,
        removeAll
    }
}