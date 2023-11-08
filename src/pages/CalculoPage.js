import React from "react";
import Divider from '@mui/material/Divider';
import { INPCProvider } from "../context/INPCProvider";
import OuterContainer from "../components/OuterContainer";
import Header from "../components/Header";
import CalculoContainer from "../components/CalculoContainer";

const CalculoPage = () => {
    return (
        <INPCProvider>
            <OuterContainer>
                <Header />
                <Divider style={{width:'100%', marginBottom: "2rem"}} />
                <CalculoContainer />
            </OuterContainer>
        </INPCProvider>
    );
}

export default CalculoPage;
