import { createContext, useState } from 'react';

export const CalculoContext = createContext();

export const CalculoProvider = ({ children }) => {

    const [calculo, setCalculo] = useState(
        {
            advogado: "",
            numProcesso: "",
            cidade: "",
            honorarios: "",
            calculos: [],
        }
    );

    const [extrasList, setExtrasList] = useState([
        {
            id: "0",
            valor: "",
            juros: "",
            multa: "",
            honorarios: calculo.honorarios,
            dataInicial: "",
            dataFinal: "",
            dataInicialJuros: "",
            dataFinalJuros: "",
            isCalculoUnico: true,
        },
    ]);


    const value = {
        calculo,
        setCalculo,
        extrasList,
        setExtrasList
    };

    return (
        <CalculoContext.Provider value={value}>
            {children}
        </CalculoContext.Provider>
    );
};
