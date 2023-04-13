import styled from "styled-components";

export const LayoutContainer = styled.div `

    max-width: 74rem;
    height: calc(10vh -10rem);
    margin: 5rem auto; 

    background-color: ${(props => props.theme["gray-800"])};
    border-radius: 8px;

    display:flex;
    flex-direction: column;
`;