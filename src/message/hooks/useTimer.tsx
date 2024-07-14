import { useEffect, useRef } from "react"

interface UseTimerProps {
    duration?: number,
    remove: (id: number) => void,
    id: number
}



export default function useTimer(props: UseTimerProps) {

    const { duration = 3000, remove, id } = props

    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        startTimer()

        return ()=>{
            cloaseTimer()
        }
    }, [])

    const startTimer = () => {
        timerRef.current = window.setTimeout(() => {
           remove(id)
        }, duration)
    }

    const cloaseTimer = ()=>{
        if(timerRef.current){
            clearTimeout(timerRef.current)
        }

    }


    const onMouseEnter = () => {
        cloaseTimer()
    }

    const onMouseLeave = () => {
        startTimer()
    }

    return {
        onMouseEnter,
        onMouseLeave,
    }
}