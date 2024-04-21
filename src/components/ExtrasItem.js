import React, { useContext, useEffect, useState } from "react";
import FormControl from '@mui/material/FormControl';
import CurrencyInputField from "./elements/CurrencyInputField";
import PercentageInputField from "./elements/PercentageInputField";
import DateInputField from "./elements/DateInputField";
import { INPCContext } from "../context/INPCProvider";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { CalculoContext } from "../context/CalculoProvider";

const ExtrasItem = ({ calculoItem }) => {

    const {calculo, setCalculo} = useContext(CalculoContext);

    const [valor, setValor] = useState(calculoItem.valor);
    const [juros, setJuros] = useState(calculoItem.juros);
    const [multa, setMulta] = useState(calculoItem.multa);
    const [dataInicial, setDataInicial] = useState(calculoItem.dataInicial);
    const [dataFinal, setDataFinal] = useState(calculoItem.dataFinal);
    const [dataInicialJuros, setDataInicialJuros] = useState(calculoItem.dataInicialJuros);
    const [dataFinalJuros, setDataFinalJuros] = useState(calculoItem.dataFinalJuros);
    const [isCalculoUnico, setIsCalculoUnico] = useState(calculoItem.isCalculoUnico);
    const [dataFinalCalculo, setDataFinalCalculo] = useState(calculoItem.dataFinalCalculo);
    const [showDataFinalCalculo, setShowDataFinalCalculo] = useState(false);

    const { ultimaDataIndice } = useContext(INPCContext);

    const [helperError, setHelperError] = useState(false);
    const [helperErrorJuros, setHelperErrorJuros] = useState(false);
    const [helperErrorFinalCalculo, setHelperErrorFinalCalculo] = useState(false);
    const [errorFinalCalculo, setErrorFinalCalculo] = useState("");

    useEffect(() => {
        setValor(calculoItem.valor);
        setJuros(calculoItem.juros);
        setMulta(calculoItem.multa);
        setDataInicial(calculoItem.dataInicial);
        setDataFinal(calculoItem.dataFinal);
        setDataInicialJuros(calculoItem.dataInicialJuros);
        setDataFinalJuros(calculoItem.dataFinalJuros);
        setIsCalculoUnico(calculoItem.isCalculoUnico);
        setDataFinalCalculo(calculoItem.dataFinalCalculo);
    // eslint-disable-next-line
    }, [calculo]);

    useEffect(() => {  
        let updatedCalculoItems = calculo.calculos.map((item) => {
            if (item.id === calculoItem.id) {
                return {
                    ...item,
                    valor,
                    juros,
                    multa,
                    dataInicial,
                    dataFinal,
                    dataInicialJuros,
                    dataFinalJuros,
                    isCalculoUnico,
                    dataFinalCalculo
                };
            }
            return item;
        });
      
        setCalculo({...calculo, calculos: updatedCalculoItems});
    // eslint-disable-next-line
    }, [valor, juros, multa, dataInicial, dataFinal, dataInicialJuros, dataFinalJuros, isCalculoUnico, dataFinalCalculo]);

    useEffect(() => {
        const dia = "01";
        const [mesInicial, anoInicial] = dataInicial.split('/');
        const dataInicialDate = new Date(`${mesInicial}/${dia}/${anoInicial}`);

        const [mesFinal, anoFinal] = dataFinal.split('/');
        const dataFinalDate = new Date(`${mesFinal}/${dia}/${anoFinal}`);

        if ((dataInicialDate.toString() === "Invalid Date" || dataFinalDate.toString() === "Invalid Date")
            || (anoInicial.length !== 4 || anoFinal.length !== 4)
            || (dataInicialDate > new Date() || dataInicialDate < new Date("01/01/1994"))
            || (dataFinalDate > new Date() || dataFinalDate < new Date("01/01/1994"))
            || (dataInicialDate > dataFinalDate)
        ) {
            setHelperError(true);
            return;
        }

        setHelperError(false);
    }, [dataInicial, dataFinal]);
    

    useEffect(() => {
        const [diaInicial, mesInicial, anoInicial] = dataInicialJuros.split('/');
        const dataInicialJurosDate = new Date(`${mesInicial}/${diaInicial}/${anoInicial}`);

        const [diaFinal, mesFinal, anoFinal] = dataFinalJuros.split('/');
        const dataFinalJurosDate = new Date(`${mesFinal}/${diaFinal}/${anoFinal}`);

        if ((Number(juros.replace(",", ".")) !== 0)
            && ( 
                (dataInicialJurosDate.toString() === "Invalid Date" || dataFinalJurosDate.toString() === "Invalid Date")
                || (anoInicial.length !== 4 || anoFinal.length !== 4)
                || (dataInicialJurosDate > new Date() || dataInicialJurosDate < new Date("01/01/1994"))
                || (dataFinalJurosDate > new Date() || dataFinalJurosDate < new Date("01/01/1994"))
                || (dataInicialJurosDate >= dataFinalJurosDate)
            )
        ) {
            setHelperErrorJuros(true);
            return;
        }

        setHelperErrorJuros(false);
    }, [dataInicialJuros, dataFinalJuros, juros]);
    

    useEffect(() => {
        if (isCalculoUnico) {
            setShowDataFinalCalculo(false);
        } else {
            setShowDataFinalCalculo(true);
        }

        const dia = "01";
        const [mesInicial, anoInicial] = dataInicial.split('/');
        const dataInicialDate = new Date(`${mesInicial}/${dia}/${anoInicial}`);

        const [mesFinal, anoFinal] = dataFinal.split('/');
        const dataFinalDate = new Date(`${mesFinal}/${dia}/${anoFinal}`);

        const diaFinalCalculo = "01";
        const [mesFinalCalculo, anoFinalCalculo] = dataFinalCalculo.split('/');
        const dataFinalCalculoDate = new Date(`${mesFinalCalculo}/${diaFinalCalculo}/${anoFinalCalculo}`);

        if (!isCalculoUnico 
            && ((dataFinalCalculoDate.toString() === "Invalid Date")
            || (anoFinalCalculo.length !== 4)
            || (dataFinalCalculoDate > new Date() || dataFinalCalculoDate < new Date("01/01/1994") || dataFinalCalculoDate > ultimaDataIndice)
            || (dataFinalCalculoDate > dataFinalDate)
            || (dataFinalCalculoDate < dataInicialDate))
        ) {
            setHelperErrorFinalCalculo(true);

            if (dataFinalCalculoDate > dataFinalDate) {
                setErrorFinalCalculo("Maior Final");
            } else if (dataFinalCalculoDate < dataInicialDate) {
                setErrorFinalCalculo("Menor Inicial")
            } else {
                setErrorFinalCalculo("Insira uma data válida!");
            }

            return;
        }

        setHelperErrorFinalCalculo(false);
        setErrorFinalCalculo("");
    }, [isCalculoUnico, dataFinalCalculo, dataInicial, dataFinal, ultimaDataIndice]);
    
    return (
        <div className="flex flex-col items-center justify-center w-full pb-6 space-y-3">
            <div className="mb-3 font-semibold text-2xl">
                <h1>
                    Cálculo {calculo.calculos.indexOf(calculoItem) + 1} ({`ID: ${calculoItem.id}`})
                </h1>
            </div>

            <div className="w-full flex flex-col items-center justify-center">
                <FormControl variant="outlined" className="flex-1 min-w-[60%] max-w-prose w-[32rem]">
                    <CurrencyInputField 
                        label={"Valor inicial"}
                        value={valor}
                        setValue={setValor}
                        maxValue={1000000000} 
                    />
                </FormControl>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <FormControl variant="outlined" className="flex-1">
                    <DateInputField
                        label={"Data Inicial"}
                        value={dataInicial}
                        setValue={setDataInicial}
                        helperError={helperError}
                        type="MM/AAAA"
                        ultimaDataIndice={ultimaDataIndice}
                    />
                </FormControl>
            
                <FormControl variant="outlined" className="flex-1">
                    <DateInputField
                        label={"Data Final"}
                        value={dataFinal}
                        setValue={setDataFinal}
                        helperError={helperError}
                        type="MM/AAAA"
                        ultimaDataIndice={ultimaDataIndice}
                    />
                </FormControl>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <FormControl variant="outlined" className="flex-1">
                    <PercentageInputField
                        label={"Multa"}
                        value={multa}
                        setValue={setMulta}
                        maxValue={100000}
                    />
                </FormControl>

                <FormControl variant="outlined" className="flex-1">
                    <PercentageInputField 
                        label={"Juros"}
                        value={juros}
                        setValue={setJuros}
                        maxValue={100000} 
                    />
                </FormControl>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <FormControl variant="outlined" className="flex-1">
                    <DateInputField
                        label={"Data Inicial Juros"}
                        value={dataInicialJuros}
                        setValue={setDataInicialJuros}
                        helperErrorJuros={helperErrorJuros}
                        disabled={Number(juros.replace(",", ".")) === 0}
                        type="DD/MM/AAAA"
                    />
                </FormControl>

                <FormControl variant="outlined" className="flex-1">
                    <DateInputField
                        label={"Data Final Juros"}
                        value={dataFinalJuros}
                        setValue={setDataFinalJuros}
                        helperErrorJuros={helperErrorJuros}
                        disabled={Number(juros.replace(",", ".")) === 0}
                        type="DD/MM/AAAA"
                    />
                </FormControl>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <RadioGroup value={isCalculoUnico} onChange={() => setIsCalculoUnico(!isCalculoUnico)}>
                    <FormControlLabel control={<Radio value={true} />} label="Cálculo único" />
                    <FormControlLabel control={<Radio value={false} />} label="Cálculo mês a mês" />
                </RadioGroup>

            </div>

            {showDataFinalCalculo ?                 
                <FormControl variant="outlined" className="flex-1">
                    <DateInputField
                        label={"Data Final Cálculo"}
                        value={dataFinalCalculo}
                        setValue={setDataFinalCalculo}
                        helperErrorFinalCalculo={helperErrorFinalCalculo}
                        errorFinalCalculo={errorFinalCalculo}
                        type="MM/AAAA"
                        ultimaDataIndice={ultimaDataIndice}
                    />
                </FormControl> 
            : null}
        </div>
    );
}

export default ExtrasItem;
