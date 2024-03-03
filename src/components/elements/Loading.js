import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loading = ({loading, message}) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 999 }}
            open={loading}
            className="flex flex-col items-center justify-center"
        >
            <CircularProgress 
                color="primary"
                thickness={6}
                value={66}
                disableShrink={true}
            />

            <div className="mt-2 font-medium">
                {message}
            </div>
        </Backdrop>
    );
}

export default Loading;
