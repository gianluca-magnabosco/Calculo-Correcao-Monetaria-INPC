import React, { useContext, useEffect, useState } from "react";
import CalculoItem from "./CalculoItem";
import InnerContainer from "./InnerContainer";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { INPCContext } from '../context/INPCProvider';
import { gerarCalculo, isCalculoValid } from "../functions/calculoFunctions";
import { useNavigate } from "react-router-dom";
import { CalculoContext } from "../context/CalculoProvider";


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

    const {calculo, setCalculo} = useContext(CalculoContext);

    const [disabled, setDisabled] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading) {
            let result = gerarPDF(calculo, variacoesINPC);

            let debitoDoExecutado = result.reduce((total, item) => total + Number(item.montanteCorrigidoComJurosEMulta), 0);
            let debitoValorHonorarios = (debitoDoExecutado * (Number(result[0].honorarios.replace(",", ".").replace("%", "")) / 100));
            let totalGeral = (Number(debitoDoExecutado.toFixed(2)) + Number(debitoValorHonorarios.toFixed(2))).toFixed(2);

            
            navigate("/pdf", { state: { calculo: calculo, calculosArray: result, debitoDoExecutado: debitoDoExecutado, debitoValorHonorarios: debitoValorHonorarios, totalGeral: totalGeral }});
            setLoading(false);
        }
    // eslint-disable-next-line
    }, [loading]);

    useEffect(() => {
        if (!isCalculoValid(calculo, ultimaDataIndice)) {
            setDisabled(true);
            return;
        }

        setDisabled(false);
    }, [calculo, ultimaDataIndice]);

    return (
        <div className="flex flex-1 flex-col items-center justify-center w-full">
            <div className="text-xl font-medium">
                Última data do índice do INPC: {!ultimaDataIndice ? "" : `${(ultimaDataIndice.getMonth() + 1).toString().padStart(2, '0')}/${ultimaDataIndice.getFullYear()}`}
            </div>

            <Backdrop
                sx={{ color: '#fff', zIndex: 999 }}
                open={loading}
                className="flex flex-col items-center justify-center"
            >
                <CircularProgress 
                    color="primary"
                    thickness={6}
                    value={66}
                    disableShrink={true}
                />

                <div className="mt-2 font-medium">
                    Gerando PDF...
                </div>
            </Backdrop>

            <InnerContainer>
                <CalculoItem calculo={calculo} setCalculo={setCalculo} />
            </InnerContainer>

            <div className="pb-20">
                <Button
                    variant="contained"
                    size="large"
                    style={{ borderRadius: 5, backgroundColor: "#0068b3" }}
                    disabled={disabled}
                    onClick={() => {
                        setLoading(true);
                    }}
                >
                    GERAR CÁLCULO
                </Button>
            </div>
        </div>
    );
}

export default CalculoContainer;
