import React from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';

const PercentageInputField = ({ value, setValue, label, maxValue }) => {

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (rawValue === "") {
            setValue("0,00");
            return;
        }

        if (rawValue / 100 > maxValue) {
            return;
        }
        
        setValue(`${(rawValue / 100).toFixed(2).replace(".", ",")}`);
    };

    return (
        <TextField
            value={value}
            label={label}
            onChange={handleInputChange}
            placeholder="0,00"
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon size={"10px"}/>
                  </InputAdornment>
                ),
            }}
        />
    );
};

export default PercentageInputField;
