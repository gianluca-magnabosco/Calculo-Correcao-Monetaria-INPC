import React, { useEffect, useState } from 'react';
import 'dayjs/locale/pt-br';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';

const DateInputField = ({ value, setValue, label, type, disabled, helperError, helperErrorJuros, helperErrorFinalCalculo, errorFinalCalculo, ultimaDataIndice }) => {

    const [localValue, setLocalValue] = useState(null);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (parmValue) => {
        if (parmValue == null) {
            setValue("");
            return;
        }

        let date = parmValue.toDate();

        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let ano = date.getFullYear();

        if (dia < 10) dia = '0' + dia;
        if (mes < 10) mes = '0' + mes;

        if (type === "MM/AAAA") {
            setValue(`${mes}/${ano}`);
            return;
        }

        if (type === "DD/MM/AAAA") {
            setValue(`${dia}/${mes}/${ano}`);
            return;
        }
    };

    useEffect(() => {
        setLocalValue(value === "" ? null : type === "MM/AAAA" ? dayjs(`01/${value}`, 'DD/MM/YYYY') : dayjs(`${value}`, 'DD/MM/YYYY'));

        if (disabled) {
            setError(false);
            setErrorMessage("");
            return;
        }

        if (localValue == null) {
            if (value !== "") {
                setLocalValue(type === "MM/AAAA" ? dayjs(`01/${value}`, 'DD/MM/YYYY') : dayjs(`${value}`, 'DD/MM/YYYY'));
            } else {
                setError(true);
                setErrorMessage("Insira uma data");
                return;
            }
        }

        if (type === "MM/AAAA" && value.length === 7) {
            const [month, year] = value.split('/');
            const day = "01";
            const date = new Date(`${month}/${day}/${year}`);
            
            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994") || date > ultimaDataIndice) {
                setError(true);
                setErrorMessage("Insira uma data válida!");
                return;
            }
        }

        if (type === "DD/MM/AAAA" && value.length === 10) {
            const [day, month, year] = value.split('/');
            const date = new Date(`${month}/${day}/${year}`);

            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994")) {
                setError(true);
                setErrorMessage("Insira uma data válida!");
                return;
            }
        }

        if (helperError) {
            setError(true);
            if (label === "Data Inicial") {
                setErrorMessage("A data inicial deve ser anterior à data final.");
            } else {
                setErrorMessage("A data final deve ser posterior à data inicial.");
            }
            return;
        }

        if (helperErrorJuros) {
            setError(true);
            if (label === "Data Inicial Juros") {
                setErrorMessage("A data inicial deve ser anterior à data final.");
            } else {
                setErrorMessage("A data final deve ser posterior à data inicial.");
            }
            return;
        }

        if (helperErrorFinalCalculo) {
            setError(true);
            if (errorFinalCalculo === "Menor Inicial") {
                setErrorMessage("A data final do cálculo deve ser posterior à data inicial.");
            } else if (errorFinalCalculo === "Maior Final") {
                setErrorMessage("A data final do cálculo deve ser anterior à data final.");
            } else {
                setErrorMessage("Insira uma data válida!");
            }
            return;
        }

        setError(false);
        setErrorMessage("");
    // eslint-disable-next-line 
    }, [value, disabled, helperError, helperErrorJuros, ultimaDataIndice, helperErrorFinalCalculo, errorFinalCalculo, label, type]);

    return (
        <div className="flex flex-col items-start justify-start">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'} localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}>
                <DatePicker
                    disabled={disabled}
                    label={label}
                    format={type === "MM/AAAA" ? "MM/YYYY" : "DD/MM/YYYY"}
                    value={localValue}
                    onChange={(newValue) => handleChange(newValue)}
                    slotProps={{ textField: { variant: 'outlined', error: error, helperText: errorMessage } }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default DateInputField;
