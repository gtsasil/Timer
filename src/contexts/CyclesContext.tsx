import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { ActionTypes, addNewCycleAction, interrupCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../Reducers/cycles/actions";
import {Cycle, CyclesReducer } from "../Reducers/cycles/reducer";

interface CreateCycleData {
    task: string;
    minutesAmount: number
}

interface CycleContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined;
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interrupCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CycleContextType);

interface CycleContextProviderProps {
    children: ReactNode;
}


export function CyclesContextProvider({ children }: CycleContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(CyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        (initialSate) => {
            const storedStateJSON = localStorage.getItem('@Timer:cycles-state-1.0.0')
            if(storedStateJSON){
                return JSON.parse(storedStateJSON)
            }

            return initialSate
        })

    useEffect(() => {
      const stateJSON = JSON.stringify(cyclesState)
    
     localStorage.setItem('@Timer:cycles-state-1.0.0', stateJSON)
     
    })
    
    const { cycles, activeCycleId } = cyclesState;

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)


    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle){
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0
    })



    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
    }

    function interrupCurrentCycle() {
        dispatch(interrupCurrentCycleAction())
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                amountSecondsPassed,
                markCurrentCycleAsFinished,
                setSecondsPassed,
                createNewCycle,
                interrupCurrentCycle,
            }}>
            {children}
        </CyclesContext.Provider>
    )
}