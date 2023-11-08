import React, { useContext, useEffect, useState } from "react";
import FormControl from '@mui/material/FormControl';
import CurrencyInputField from "./CurrencyInputField";
import PercentageInputField from "./PercentageInputField";
import DateInputField from "./DateInputField";
import { INPCContext } from "../context/INPCProvider";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const ExtrasItem = ({ calculo, extrasList, setExtrasList }) => {

    const [valor, setValor] = useState(calculo.valor);
    const [juros, setJuros] = useState(calculo.juros);
    const [multa, setMulta] = useState(calculo.multa);
    const [dataInicial, setDataInicial] = useState(calculo.dataInicial);
    const [dataFinal, setDataFinal] = useState(calculo.dataFinal);
    const [dataInicialJuros, setDataInicialJuros] = useState(calculo.dataInicialJuros);
    const [dataFinalJuros, setDataFinalJuros] = useState(calculo.dataFinalJuros);
    const [isCalculoUnico, setIsCalculoUnico] = useState(calculo.isCalculoUnico);

    const { ultimaDataIndice } = useContext(INPCContext);

    useEffect(() => {
        const updatedExtrasList = extrasList.map((item) => {
          if (item.id === calculo.id) {
            return {
                ...item,
                valor,
                juros,
                multa,
                dataInicial,
                dataFinal,
                dataInicialJuros,
                dataFinalJuros,
                isCalculoUnico
            };
        }
            return item;
        });
      
        setExtrasList(updatedExtrasList);
    
    // eslint-disable-next-line
    }, [valor, juros, multa, dataInicial, dataFinal, dataInicialJuros, dataFinalJuros, isCalculoUnico]);

    const [helperError, setHelperError] = useState(false);
    const [helperErrorJuros, setHelperErrorJuros] = useState(false);

    useEffect(() => {
        const dia = "01";
        const [mesInicial, anoInicial] = dataInicial.split('/');
        const dataInicialDate = new Date(`${mesInicial}/${dia}/${anoInicial}`);

        const [mesFinal, anoFinal] = dataFinal.split('/');
        const dataFinalDate = new Date(`${mesFinal}/${dia}/${anoFinal}`);

        if ((dataInicialDate.toString() !== "Invalid Date" && dataFinalDate.toString() !== "Invalid Date")
            && (anoInicial.length === 4 && anoFinal.length === 4)
            && (dataInicialDate < new Date() && dataInicialDate > new Date("01/01/1994"))
            && (dataFinalDate < new Date() && dataFinalDate > new Date("01/01/1994"))
            && (dataInicialDate >= dataFinalDate)
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
            && (dataInicialJurosDate.toString() !== "Invalid Date" && dataFinalJurosDate.toString() !== "Invalid Date")
            && (anoInicial.length === 4 && anoFinal.length === 4)
            && (dataInicialJurosDate < new Date() && dataInicialJurosDate > new Date("01/01/1994"))
            && (dataFinalJurosDate < new Date() && dataFinalJurosDate > new Date("01/01/1994"))
            && (dataInicialJurosDate >= dataFinalJurosDate)
        ) {
            setHelperErrorJuros(true);
            return;
        }

        setHelperErrorJuros(false);
    }, [dataInicialJuros, dataFinalJuros, juros]);
    
    
    return (
        <div className="flex flex-col items-center justify-center w-full pb-6 pt-2 space-y-3">
            <FormControl variant="outlined" fullWidth sx={{maxWidth: "23.5rem"}}>
                <CurrencyInputField 
                    label={"Valor inicial"}
                    value={valor}
                    setValue={setValor}
                    maxValue={1000000000} 
                />
            </FormControl>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
                    <DateInputField
                        label={"Data Inicial"}
                        value={dataInicial}
                        setValue={setDataInicial}
                        helperError={helperError}
                        type="MM/AAAA"
                        ultimaDataIndice={ultimaDataIndice}
                    />
                </FormControl>

                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
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
                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
                    <PercentageInputField
                        label={"Multa"}
                        value={multa}
                        setValue={setMulta}
                        maxValue={100000}
                    />
                </FormControl>

                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
                    <PercentageInputField 
                        label={"Juros"}
                        value={juros}
                        setValue={setJuros}
                        maxValue={100000} 
                    />
                </FormControl>
            </div>

            <div className="flex flex-row items-center justify-center space-x-2 flex-wrap">
                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
                    <DateInputField
                        label={"Data Inicial Juros"}
                        value={dataInicialJuros}
                        setValue={setDataInicialJuros}
                        helperErrorJuros={helperErrorJuros}
                        disabled={Number(juros.replace(",", ".")) === 0}
                        type="DD/MM/AAAA"
                    />
                </FormControl>

                <FormControl variant="outlined" sx={{maxWidth: "11.5rem"}}>
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
        </div>
    );
}

export default ExtrasItem;
