import { createContext, useState } from "react";

export const newContext = createContext();

export const NewContextProvideFunc = ({ children }) => {

    const [ID, setID] = useState();

    return (
        <>
            <newContext.Provider value={{ID, setID}}>
                {children}
            </newContext.Provider>
        </>
    )
}