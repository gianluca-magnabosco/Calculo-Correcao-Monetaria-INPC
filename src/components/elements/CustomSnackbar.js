import React from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AlertTitle } from "@mui/material";

const CustomSnackbar = ({ message, setMessage, type }) => {

    return (
        <Snackbar 
            open={message !== ""} 
            autoHideDuration={5000} 
            onClose={() => setMessage("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <MuiAlert 
                elevation={6} 
                variant="filled" 
                onClose={() => setMessage("")} 
                severity={type} 
                sx={{ width: '100%'}}
            >
                <AlertTitle>
                    {type === "error" ? "Erro!" : "Sucesso!"}
                </AlertTitle>
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

export default CustomSnackbar;
