import React, { useContext, useEffect, useState } from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import InnermostContainer from "./InnermostContainer";
import ExtrasItem from "./ExtrasItem";
import { Button, FormControl, TextField } from "@mui/material";
import CustomComboBox from "./CustomComboBox";
import PercentageInputField from "./PercentageInputField";
import { CalculoContext } from "../context/CalculoProvider";


const advogados = ["Advogado 1"];
const cidades = ["Cidade 1"];

const CalculoItem = ({ calculo, setCalculo }) => {
    const [count, setCount] = useState(1);
    
    const [advogado, setAdvogado] = useState(calculo.advogado);
    const [numProcesso, setNumProcesso] = useState(calculo.numProcesso);
    const [cidade, setCidade] = useState(calculo.cidade);
    const [honorarios, setHonorarios] = useState(calculo.honorarios);

    const {extrasList, setExtrasList} = useContext(CalculoContext);

    useEffect(() => {
        const updatedCalculos = extrasList.map(item => ({
            ...item,
            honorarios: honorarios
        }));

        setCalculo({ ...calculo, advogado: advogado, numProcesso: numProcesso, cidade: cidade, honorarios: honorarios, calculos: updatedCalculos });
    // eslint-disable-next-line
    }, [advogado, numProcesso, cidade, honorarios, extrasList]);

    return (
        <div className="flex flex-col flex-wrap space-x-2 justify-center items-center w-full">

            <div className="flex flex-col my-2 flex-wrap space-y-3 justify-center items-center w-full p-3">
                <FormControl variant="outlined" className="w-full">
                    <CustomComboBox 
                        label={"Advogado"}
                        value={advogado}
                        setValue={setAdvogado}
                        defaultValues={advogados} 
                    />
                </FormControl>

                <FormControl variant="outlined" className="w-full">
                    <TextField 
                        label={"Número do processo"}
                        value={numProcesso}
                        onChange={(event) => setNumProcesso(event.target.value)}
                    />
                </FormControl>

                <FormControl variant="outlined" className="w-full">
                    <CustomComboBox 
                        label={"Cidade"}
                        value={cidade}
                        setValue={setCidade}
                        defaultValues={cidades} 
                    />
                </FormControl>

                <FormControl variant="outlined" className="w-full">
                    <PercentageInputField 
                        label={"Honorários"}
                        value={honorarios}
                        setValue={setHonorarios}
                        maxValue={1000} 
                    />
                </FormControl>
            </div>

            <div className="mb-3 flex flex-col items-center justify-center w-[75%]">
                {extrasList.map((item) => (
                    <InnermostContainer                    
                        key={item.id} 
                        id={item.id} 
                        disabled={extrasList.length <= 1} 
                        onDelete={(id) => setExtrasList(extrasList.filter((item) => item.id !== id))}
                    >
                        <ExtrasItem 
                            key={item.id} 
                            calculo={item} 
                            extrasList={extrasList}
                            setExtrasList={setExtrasList}
                        />
                    </InnermostContainer>   
                ))}

                <Button
                    variant="contained"
                    style={{ borderRadius: 5, width: '48px', height: '42px', backgroundColor: "#0068b3" }}
                    onClick={() => {
                        setCount(count + 1);
                        setExtrasList([...extrasList, {
                            id: (count + 1).toString(),
                            valor: "",
                            juros: "",
                            multa: "",
                            honorarios: calculo.honorarios,
                            dataInicial: "",
                            dataFinal: "",
                            dataInicialJuros: "",
                            dataFinalJuros: "",
                            isCalculoUnico: true,
                        }]);
                    }}
                >
                    <ControlPointIcon sx={{ color: "white", fontSize: "24px" }} />
                </Button>
            </div>
        </div>
    );
}

export default CalculoItem;
