import { createContext, useState, useEffect } from 'react';
import Loading from '../components/elements/Loading';
import CustomSnackbar from '../components/elements/CustomSnackbar';

const googleScriptID = process.env.REACT_APP_GOOGLE_SCRIPT_ID;
const googleScriptURL = `https://script.google.com/macros/s/${googleScriptID}/exec`;

export const CalculoContext = createContext();

export const CalculoProvider = ({ children }) => {

    const calculoLimpo = {
        advogado: "",
        numProcesso: "",
        cidade: "",
        honorarios: "",
        calculos: [{
            id: "1",
            valor: "",
            juros: "",
            multa: "",
            honorarios: "",
            dataInicial: "",
            dataFinal: "",
            dataInicialJuros: "",
            dataFinalJuros: "",
            isCalculoUnico: true,
            dataFinalCalculo: "",
        }],
    }

    const getCalculosSalvos = async () => {
        try {
            const response = await fetch(googleScriptURL);
  
            if (!response.ok) {
                throw new Error(`Erro ao baixar cálculos salvos: ${response.status} ${response.statusText}`);
            }
  
            const data = await response.json();

            const dataSorted = data.sort((a, b) => a.nome.localeCompare(b.nome));

            setCalculosSalvos(dataSorted);
            setLoadingCalculos(false);
        } catch (error) {
            console.error(error);
        }
    }

    const saveCalculo = async (calculoToBeSaved, nomeCalculo) => {
        try {
            const response = await fetch(`${googleScriptURL}?calculo=${nomeCalculo}`, {
                mode: "no-cors",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calculoToBeSaved),
            });
    
            if (!response.status === 302) {
                throw new Error(`Erro ao salvar cálculo: ${response.status} ${response.statusText}`);
            }      

            await getCalculosSalvos();
            setNomeCalculo(nomeCalculo);
            setAction("save");
            setLoadingSaveCalculo(false);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteCalculo = async (nomeCalculo) => {
        try {
            const response = await fetch(`${googleScriptURL}?action=delete&calculo=${nomeCalculo}`, {
                mode: "no-cors",
                method: 'POST'
            });
    
            if (!response.status === 302) {
                throw new Error(`Erro ao deletar cálculo: ${response.status} ${response.statusText}`);
            }      

            await getCalculosSalvos();
            setNomeCalculo(nomeCalculo);
            setAction("delete");
            setLoadingDeleteCalculo(false);
        } catch (error) {
            console.error(error);
        }
    }

    const [calculos, setCalculos] = useState([]);

    const [calculo, setCalculo] = useState({...calculoLimpo});

    const [calculosSalvos, setCalculosSalvos] = useState([]);

    const [loadingCalculos, setLoadingCalculos] = useState(true);

    const [loadingSaveCalculo, setLoadingSaveCalculo] = useState(false);

    const [loadingDeleteCalculo, setLoadingDeleteCalculo] = useState(false);

    const [nomeCalculo, setNomeCalculo] = useState("");

    const [action, setAction] = useState("");

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        if (loadingCalculos || loadingSaveCalculo || loadingDeleteCalculo) {
            async function getCalculosTemp() {
                await getCalculosSalvos();
            }
            getCalculosTemp();
        }
    // eslint-disable-next-line
    }, [loadingCalculos, loadingSaveCalculo, loadingDeleteCalculo]);

    useEffect(() => {
        if (calculosSalvos.length > 0 && action === "save") {
            const calculoIndex = calculosSalvos.findIndex(item => item.nome.toUpperCase() === nomeCalculo.toUpperCase());
            if (calculoIndex !== -1) {
                setSuccess("Cálculo salvo com sucesso!");
            } else {
                setError("Erro ao salvar cálculo!");
            }
        }

        if (calculosSalvos.length > 0 && action === "delete") {
            const calculoIndex = calculosSalvos.findIndex(item => item.nome.toUpperCase() === nomeCalculo.toUpperCase());
            if (calculoIndex === -1) {
                setSuccess("Cálculo excluído com sucesso!");
            } else {
                setError("Erro ao excluir cálculo!");
            }
        }

        setNomeCalculo("");
        setAction("");
    }, [calculosSalvos, nomeCalculo, action])

    const value = {
        saveCalculo,
        deleteCalculo,
        setLoadingCalculos,
        setLoadingSaveCalculo,
        setLoadingDeleteCalculo,
        calculoLimpo,
        calculosSalvos,
        setCalculosSalvos,
        calculos,
        setCalculos,
        calculo,
        setCalculo
    };

    return (
        <CalculoContext.Provider value={value}>
            <>
                <Loading loading={loadingCalculos && !loadingSaveCalculo && !loadingDeleteCalculo} message="Baixando cálculos salvos..." />
                <Loading loading={loadingSaveCalculo} message="Salvando cálculo..." />
                <Loading loading={loadingDeleteCalculo} message="Excluindo cálculo..." />

                <CustomSnackbar message={success} setMessage={setSuccess} type="success" />
                <CustomSnackbar message={error} setMessage={setError} type="error" />

                {children}
            </>
        </CalculoContext.Provider>
    );
};
