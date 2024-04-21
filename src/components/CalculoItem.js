import React, { useContext, useEffect, useState } from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import InnermostContainer from "./InnermostContainer";
import ExtrasItem from "./ExtrasItem";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import CustomComboBox from "./elements/CustomComboBox";
import PercentageInputField from "./elements/PercentageInputField";
import { CalculoContext } from "../context/CalculoProvider";
import CalculoComboBox from "./elements/CalculoComboBox";
import ConfirmationPopup from "./elements/ConfirmationPopup";


const advogados = [process.env.REACT_APP_ADVOGADOS];
const cidades = [process.env.REACT_APP_CIDADES];

const CalculoItem = ({ disabled }) => {
    const [count, setCount] = useState(1);

    const {calculo, setCalculo, calculosSalvos, setLoadingCalculos, setLoadingSaveCalculo, setLoadingDeleteCalculo, saveCalculo, deleteCalculo} = useContext(CalculoContext);

    const [advogado, setAdvogado] = useState(calculo.advogado);
    const [numProcesso, setNumProcesso] = useState(calculo.numProcesso);
    const [cidade, setCidade] = useState(calculo.cidade);
    const [honorarios, setHonorarios] = useState(calculo.honorarios);

    const [nomeCalculo, setNomeCalculo] = useState("");
    const [importCalculo, setImportCalculo] = useState(false);

    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const saveCalculoToSheet = () => {
        saveCalculo(calculo, nomeCalculo);
        setLoadingCalculos(true);
        setLoadingSaveCalculo(true);
        setShowSavePopup(false);
    }

    const deleteCalculoOnSheet = () => {
        deleteCalculo(nomeCalculo);
        setLoadingCalculos(true);
        setLoadingDeleteCalculo(true);
        setShowDeletePopup(false);
    }

    useEffect(() => {
        let calculoObj = calculosSalvos.filter((item) => item.nome.toUpperCase() === nomeCalculo.toUpperCase());
    
        if (calculoObj.length > 0 && importCalculo) {
            setCalculo({ ...calculoObj[0].calculo});
            setCount(calculoObj[0].calculo.calculos.length);
            setImportCalculo(false);
        }
    // eslint-disable-next-line 
    }, [importCalculo]);
    
    useEffect(() => {
        setAdvogado(calculo.advogado);
        setNumProcesso(calculo.numProcesso);
        setCidade(calculo.cidade);
        setHonorarios(calculo.honorarios);
    }, [calculo]);

    useEffect(() => {
        setCalculo(prevCalculo => {
            const updatedCalculos = prevCalculo.calculos.map(item => ({
                ...item,
                honorarios: honorarios
            }));
    
            return { 
                ...prevCalculo, 
                advogado: advogado, 
                numProcesso: numProcesso, 
                cidade: cidade, 
                honorarios: honorarios, 
                calculos: updatedCalculos 
            };
        });
    // eslint-disable-next-line
    }, [advogado, numProcesso, cidade, honorarios]);



    return (
        <div className="flex flex-col flex-wrap space-x-2 justify-center items-center w-full">

            <ConfirmationPopup open={showSavePopup} message={`Já existe um cálculo com o nome "${nomeCalculo}".`} message2={`Deseja sobrescrevê-lo?`} onConfirm={() => saveCalculoToSheet()} onClose={() => setShowSavePopup(false)} />
            <ConfirmationPopup open={showDeletePopup} message={`Tem certeza que deseja excluir o cálculo "${nomeCalculo}"?`} message2={``} onConfirm={() => deleteCalculoOnSheet()} onClose={() => setShowDeletePopup(false)} />

            <div className="flex flex-col mb-2 flex-wrap space-y-3 justify-center items-center w-full p-3">
            
                <div className="w-full space-y-1">
                    <Typography variant="h5">
                        Gerenciar cálculos
                    </Typography>

                    <div className="flex flex-row w-full space-x-3 pt-2">
                        <FormControl variant="outlined" className="w-full">
                            <CalculoComboBox 
                                label={"Nome do cálculo"}
                                value={nomeCalculo}
                                setValue={setNomeCalculo}
                                defaultValues={calculosSalvos.map((item) => item.nome)} 
                            />
                        </FormControl>

                        <Button
                            variant="contained"
                            size="small"
                            style={{ borderRadius: 5, backgroundColor: "#086CB4", maxWidth: "20%" }}
                            disabled={nomeCalculo.trim() === "" || calculosSalvos.filter((item) => item.nome.toUpperCase() === nomeCalculo.toUpperCase()).length === 0}
                            onClick={() => {
                                setImportCalculo(true);
                            }}
                        >
                            IMPORTAR CÁLCULO
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            style={{ borderRadius: 5, backgroundColor: "#6CB408", maxWidth: "20%" }}
                            disabled={disabled || nomeCalculo.trim() === ""}
                            onClick={() => {
                                if (calculosSalvos.filter((item) => item.nome.toUpperCase() === nomeCalculo.toUpperCase()).length > 0) {
                                    setShowSavePopup(true);
                                    return;
                                }
                                saveCalculoToSheet();
                            }}
                        >
                            SALVAR CÁLCULO
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            style={{ borderRadius: 5, backgroundColor: "#b4086c", maxWidth: "20%" }}
                            disabled={nomeCalculo.trim() === "" || calculosSalvos.filter((item) => item.nome.toUpperCase() === nomeCalculo.toUpperCase()).length === 0}
                            onClick={() => {
                                setShowDeletePopup(true);
                            }}
                        >
                            EXCLUIR CÁLCULO
                        </Button>
                    </div>
                </div>

                <div className="w-full py-1 pb-8">
                    <hr className="w-full border-t border-1 border-gray-400" />
                </div>

                <div className="w-full space-y-1">
                    <Typography variant="h5">
                        Informações do cálculo
                    </Typography>
                </div>

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

            <div className="mb-3 flex flex-col items-center justify-center w-[90%]">
                {calculo.calculos.map((item) => (
                    <InnermostContainer                    
                        key={item.id} 
                        id={item.id} 
                        disabled={calculo.calculos.length <= 1} 
                        onDelete={(id) => setCalculo({...calculo, calculos: calculo.calculos.filter((item) => item.id !== id)})}
                    >
                        <ExtrasItem 
                            key={item.id} 
                            calculoItem={item} 
                        />
                    </InnermostContainer>   
                ))}


                <div className="flex flex-row items-center justify-center w-full space-x-2">
                    <Button
                        variant="contained"
                        style={{ borderRadius: 5, width: '88px', height: '42px', backgroundColor: "#6CB408" }}
                        onClick={() => {
                            setCount(count + 1);
                            setCalculo({...calculo, calculos: [...calculo.calculos, {
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
                                dataFinalCalculo: "",
                            }]});
                        }}
                    >
                        <ControlPointIcon sx={{ color: "white", fontSize: "24px" }} className="mr-1" /> NOVO
                    </Button>

                    <Button
                        variant="contained"
                        style={{ borderRadius: 5, width: '120px', height: '42px', backgroundColor: "#086CB4" }}
                        onClick={() => {
                            const lastCalculo = calculo.calculos[calculo.calculos.length - 1];
                            const newCalculo = {...lastCalculo, id: (count + 1).toString()};
                            setCount(count + 1);
                            setCalculo({...calculo, calculos: [...calculo.calculos, newCalculo]});
                        }}
                    >
                        <ControlPointIcon sx={{ color: "white", fontSize: "24px" }} className="mr-1" /> DUPLICAR
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CalculoItem;
