import React from 'react';

const OuterContainer = ({ children }) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-20 bg-gradient-to-r from-[#0068b3] via-[#049cc0] to-[#3898c0]">
            <div className="border-2 rounded-md bg-[#f8f8f8] flex-1 w-[95%]">
                <div className="flex flex-col items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default OuterContainer;
