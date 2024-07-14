import React, { PropsWithChildren, RefObject, useRef } from "react"
import { MessageProvider, MessageRef } from "."

interface ConfigProviderProps {
    messageRef?: RefObject<MessageRef>
}

const ConfigContext = React.createContext<ConfigProviderProps>({})

const ConfigProdiver = (props: PropsWithChildren) => {

    //context 上下文
    const messageRef = useRef(null)

    //props
    const { children } = props

    return (
        <ConfigContext.Provider value={{messageRef}}>
            <MessageProvider ref={messageRef}></MessageProvider>
            {
                children
            }
        </ConfigContext.Provider>


    )
}

export default ConfigProdiver