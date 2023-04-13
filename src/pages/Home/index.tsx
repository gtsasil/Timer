import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext } from "react";
import {
    HomeContainer,
    StartCountDownButton,
    StopCountDownButton
} from "./styles";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(1, 'O número precisa ser de no mínimo 5 minutos')
        .max(60, 'O número precisa ser de no máximo 60 minutos')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { activeCycle, createNewCycle, interrupCurrentCycle  } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data : NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDesabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormProvider  {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountDownButton onClick={interrupCurrentCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ) : (
                    <StartCountDownButton disabled={isSubmitDesabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountDownButton>
                )}
            </form>
        </HomeContainer>
    );
}