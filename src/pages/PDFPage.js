import React, { useEffect } from "react";
import { CalculoTemplate } from '../pdf/CalculoTemplate';
import { PDFViewer } from '@react-pdf/renderer';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";

const PDFPage = () => {

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (!location.state) {
            navigate("/");
        }
    // eslint-disable-next-line
    }, []);
    
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" className="bg-gradient-to-r from-[#0068b3] via-[#049cc0] to-[#3898c0]">
                    <Toolbar variant="dense">
                        <IconButton 
                            edge="start" 
                            color="inherit" 
                            aria-label="voltar" 
                            sx={{ mr: 2 }}
                            onClick={() => navigate("/")}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                
                        <Typography variant="h6" color="inherit" component="div">
                            Voltar
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            <PDFViewer>
                <CalculoTemplate calculo={location.state} />
            </PDFViewer>
        </>
    );
}

export default PDFPage;
