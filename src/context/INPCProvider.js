import { createContext, useState, useEffect } from 'react';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

const zipUrl = 'https://ftp.ibge.gov.br/Precos_Indices_de_Precos_ao_Consumidor/INPC/Serie_Historica/inpc_SerieHist.zip';
const validMonths = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export const INPCContext = createContext();

export const INPCProvider = ({ children }) => {
    const [xlsData, setXlsData] = useState(null);
    const [hasBeenLoaded, setHasBeenLoaded] = useState(false);
    const [variacoesINPC, setVariacoesINPC] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(zipUrl);
      
                if (!response.ok) {
                    throw new Error(`Erro ao baixar tabela de índices do INPC: ${response.status} ${response.statusText}`);
                }
      
                const zipData = await response.arrayBuffer();
                const zip = await JSZip.loadAsync(zipData);
      
                const fileNames = Object.keys(zip.files);
                if (fileNames.length === 0) {
                    throw new Error("Erro ao processar tabela de índices do INPC");
                }
                const xlsFile = zip.files[fileNames[0]];
        
                const xlsData = await xlsFile.async('arraybuffer');
                setXlsData(xlsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (xlsData && !hasBeenLoaded) {
            const workbook = XLSX.read(xlsData, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            const processedData = jsonData.map(row => {
                return {
                    ano: row.__EMPTY,
                    mes: row.__EMPTY_1,
                    variacao: row.__EMPTY_3
                };
            });
            
            const filteredRows = processedData.filter((item) => validMonths.includes(item.mes));

            let previousYear;

            const updatedData = filteredRows.map((item) => {
                if (item.ano === undefined) {
                    item.ano = previousYear;
                } else {
                    previousYear = item.ano;
                }

                return item;
            });

            setVariacoesINPC(updatedData);
            setHasBeenLoaded(true);
        }
    }, [xlsData, hasBeenLoaded]);



    const value = {
        variacoesINPC,
        ultimaDataIndice: !variacoesINPC[variacoesINPC.length - 1] ? undefined : new Date(`${(validMonths.indexOf(variacoesINPC[variacoesINPC.length - 1].mes) + 1).toString().padStart(2, '0')}/01/${variacoesINPC[variacoesINPC.length - 1].ano}`)
    };

    return (
        <INPCContext.Provider value={value}>
            {children}
        </INPCContext.Provider>
    );
};
