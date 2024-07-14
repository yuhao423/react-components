import { MessageProps, Postion } from ".."
import { MessagePropsList } from "../hooks/useStore"

let index = 1
export function getId(messageProps:MessageProps){

    if(messageProps.id){
        return messageProps.id
    }
    index++
    return index
}


//没有找到匹配的消息，函数将隐式返回undefined
export function getMessageListPostion(id:number,messagePropsList:MessagePropsList){
    //entie
    for(const [key,value] of Object.entries(messagePropsList)){
        if(value.find((item)=>item.id === id)){
            return key as Postion
        }
    }
}

export function getMessageIndex(id:number,messagePropsList:MessagePropsList){
    const postiton = getMessageListPostion(id,messagePropsList)
    if(postiton){
        return messagePropsList[postiton].findIndex((item)=>item.id === id) || -1
    }
    return -1
}