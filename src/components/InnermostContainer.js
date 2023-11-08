import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";

const InnermostContainer = ({ disabled, children, onDelete, id }) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4 w-full">
            <div className="border-[1px] rounded-md bg-[#fefefe] flex-1 w-full">
                <div className="flex flex-col items-center justify-center p-2 pr-3">
                    <div className="self-end text-end mt-[-0.5rem] mr-[-0.65rem]">
                        <IconButton onClick={() => onDelete(id)} disabled={disabled}>
                            <CloseIcon sx={{ color: `${disabled ? "gray" : "black"}`, fontSize: "16px" }} />
                        </IconButton>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default InnermostContainer;
