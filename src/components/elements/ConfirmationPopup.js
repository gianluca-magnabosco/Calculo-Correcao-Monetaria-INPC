import { Backdrop, Card, CardContent, CardActions, Button, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

const ConfirmationPopup = ({ open, message, message2, onConfirm, onClose }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 999 }}
            open={open}
            className="flex flex-col items-center justify-center"
        >
            <Card className="rounded bg-white pb-2 min-w-[27rem]">
                <CardContent>
                    <div className="flex justify-between items-center">
                        <Typography variant="h5" component="div" className="text-left">
                            Confirmação
                        </Typography>

                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <Divider className="pb-2" />

                    <div className="py-6">
                        <Typography variant="body2" color="text.secondary" className="text-center">
                            {message}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" className="text-center">
                            {message2}
                        </Typography>                        
                    </div>

                    <Divider className="mt-4" />
                </CardContent>
                <CardActions className="justify-center">
                    <Button 
                        style={{ borderRadius: 5, backgroundColor: "green" }} 
                        variant="contained" 
                        onClick={onConfirm} 
                        className="text-white mr-2"
                    >
                        SIM
                    </Button>

                    <Button 
                        style={{ borderRadius: 5, backgroundColor: "red" }} 
                        variant="contained" 
                        onClick={onClose} 
                        className="text-white mr-2"
                    >
                        NÃO
                    </Button>
                </CardActions>
            </Card>
        </Backdrop>
    );
};

export default ConfirmationPopup;