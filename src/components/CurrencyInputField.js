import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

const CurrencyInputField = ({ value, setValue, label, maxValue }) => {

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (rawValue === "") {
            setValue("R$ 0,00");
            return;
        }

        if (rawValue / 100 > maxValue) {
            return;
        }
        
        setValue(`R$ ${(rawValue / 100).toFixed(2).replace(".", ",")}`);
    };

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (value === "" || Number(value.replace(/[^0-9]/g, '')) === 0) {
            setError(true);
            setErrorMessage("Insira um valor!");
            return;
        }

        setError(false);
        setErrorMessage("");
    
    // eslint-disable-next-line
    }, [value]);

    return (
        <TextField
            value={value}
            label={label}
            onChange={handleInputChange}
            placeholder="R$ 0,00"
            fullWidth
            error={error}
            helperText={errorMessage}
        />
    );
};

export default CurrencyInputField;
