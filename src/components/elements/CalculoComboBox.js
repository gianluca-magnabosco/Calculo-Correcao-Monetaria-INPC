import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

const CalculoComboBox = ({ value, setValue, defaultValues, label }) => {
    return (
        <Autocomplete
            options={defaultValues}
            value={value}
            onChange={(event, newValue) => { 
              if (newValue === null) {
                setValue("");
                return;
              }
              setValue(newValue);
            }}
            inputValue={value}
            onInputChange={(event, newValue) => { 
              if (newValue === null) {
                setValue("");
                return;
              }
              setValue(newValue);
            }}
            isOptionEqualToValue={(option, value) => option === value}
            freeSolo
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};

export default CalculoComboBox;
