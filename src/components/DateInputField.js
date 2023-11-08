import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const DateInputField = ({ value, setValue, label, type, disabled, helperError, helperErrorJuros, ultimaDataIndice }) => {

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (rawValue === '') {
            setValue('');
            return;
        }

        if (type === 'DD/MM/AAAA') {
            if (rawValue.length <= 2) {
                setValue(rawValue);
            } else if (rawValue.length <= 4) {
                setValue(`${rawValue.slice(0, 2)}/${rawValue.slice(2)}`);
            } else {
                setValue(
                    `${rawValue.slice(0, 2)}/${rawValue.slice(2, 4)}/${rawValue.slice(4, 8)}`
                );
            }
        } else if (type === 'MM/AAAA') {
            if (rawValue.length <= 2) {
                setValue(rawValue);
            } else {
                setValue(`${rawValue.slice(0, 2)}/${rawValue.slice(2, 6)}`);
            }
        }
    };

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (disabled) {
            setError(false);
            setErrorMessage("");
            return;
        }

        if (value.length === 0) {
            setError(true);
            setErrorMessage("Insira uma data!");
            return;
        }

        if ((type === "MM/AAAA" && (value.length !== 7 || !/^\d{2}\/\d{4}$/.test(value)))
                || (type === "DD/MM/AAAA" && (value.length !== 10 || !/^\d{2}\/\d{2}\/\d{4}$/.test(value))
            )
        ) {
            setError(true);
            setErrorMessage("Insira uma data válida!");
            return;
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

        setError(false);
        setErrorMessage("");
    
    // eslint-disable-next-line
    }, [value, disabled, helperError, helperErrorJuros, ultimaDataIndice]);

    return (
        <TextField
            value={value}
            label={label}
            onChange={handleInputChange}
            placeholder={type}
            disabled={disabled}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <EventIcon />
                    </InputAdornment>
                ),
            }}
            error={error}
            helperText={errorMessage}
        />
    );
};

export default DateInputField;
