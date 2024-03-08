import React, { useContext, useEffect, useState } from "react";
import CalculoItem from "./CalculoItem";
import InnerContainer from "./InnerContainer";
import { Button } from "@mui/material";
import { INPCContext } from '../context/INPCProvider';
import { gerarCalculo, isCalculoValid } from "../functions/calculoFunctions";
import { useNavigate } from "react-router-dom";
import { CalculoContext } from "../context/CalculoProvider";
import Loading from "./elements/Loading";


const gerarPDF = (calculo, variacoesINPC) => {
    let resultingCalculo = [];

    for (let item of calculo.calculos) {
        let result = gerarCalculo(item, variacoesINPC);
        resultingCalculo.push(...result);
    }

    return resultingCalculo;
}

const CalculoContainer = () => {

    const navigate = useNavigate();

    const { variacoesINPC, ultimaDataIndice } = useContext(INPCContext);

    const {calculo} = useContext(CalculoContext);

    const [disabled, setDisabled] = useState(false);

    const [loadingPdf, setLoadingPdf] = useState(false);

    useEffect(() => {
        if (loadingPdf) {
            let result = gerarPDF(calculo, variacoesINPC);

            let debitoDoExecutado = result.reduce((total, item) => total + Number(item.montanteCorrigidoComJurosEMulta), 0);
            let debitoValorHonorarios = (debitoDoExecutado * (Number(result[0].honorarios.replace(",", ".").replace("%", "")) / 100));
            let totalGeral = (Number(debitoDoExecutado.toFixed(2)) + Number(debitoValorHonorarios.toFixed(2))).toFixed(2);

            navigate("/pdf", { state: { calculo: calculo, calculosArray: result, debitoDoExecutado: debitoDoExecutado, debitoValorHonorarios: debitoValorHonorarios, totalGeral: totalGeral }});
            setLoadingPdf(false);
        }
    // eslint-disable-next-line
    }, [loadingPdf]);

    useEffect(() => {
        setDisabled(!isCalculoValid(calculo, ultimaDataIndice));
    }, [calculo, ultimaDataIndice]);

    return (
        <div className="flex flex-1 flex-col items-center justify-center w-full">
            <div className="text-xl font-medium">
                Última data do índice do INPC: {!ultimaDataIndice ? "" : `${(ultimaDataIndice.getMonth() + 1).toString().padStart(2, '0')}/${ultimaDataIndice.getFullYear()}`}
            </div>

            <Loading loading={loadingPdf} message="Gerando PDF..." />

            <InnerContainer>
                <CalculoItem disabled={disabled} />
            </InnerContainer>

            <div className="pb-20">
                <Button
                    variant="contained"
                    size="large"
                    style={{ borderRadius: 5, backgroundColor: "green" }}
                    disabled={disabled}
                    onClick={() => {
                        setLoadingPdf(true);
                    }}
                >
                    GERAR CÁLCULO
                </Button>
            </div>
        </div>
    );
}

export default CalculoContainer;
