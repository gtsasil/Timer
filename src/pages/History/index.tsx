import { useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { CyclesContext } from "../../contexts/CyclesContext";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { ptBR } from "date-fns/locale";

export function History() {

    const { cycles } = useContext(CyclesContext);

    return (
        <HistoryContainer>

            <h1>Meu histórico</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount}</td>
                                    <td>{formatDistanceToNow(new Date(cycle.startDate), {addSuffix: true, locale: ptBR})}</td>
                                    <td>
                                        {cycle.finishededDate && (
                                            <Status statusColor="green">Concluído</Status>
                                        )}

                                        {cycle.interrupedDate && (
                                            <Status statusColor="red">interrompido</Status>
                                        )}

                                        {(!cycle.interrupedDate && !cycle.finishededDate) && (
                                            <Status statusColor="yellow">Em Andamento</Status>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    );
}
