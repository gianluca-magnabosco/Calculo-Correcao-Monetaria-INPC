import React from "react";

const InnerContainer = ({ children }) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-10 w-[95%]">
            <div className="border-2 rounded-md bg-[#fcfcfc] flex-1 w-[95%]">
                <div className="flex flex-col items-center justify-center p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default InnerContainer;
