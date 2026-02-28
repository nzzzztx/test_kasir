import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
    const { authData } = useAuth();
    const [activeShift, setActiveShift] = useState(null);
    const [loadingShift, setLoadingShift] = useState(true);

    const fetchActiveShift = async () => {
        if (!authData?.token) {
            setActiveShift(null);
            setLoadingShift(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/shifts/active", {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data && data.id) {
                setActiveShift(data);
            } else {
                setActiveShift(null);
            }
        } catch (err) {
            console.error("Gagal fetch shift:", err);
            setActiveShift(null);
        } finally {
            setLoadingShift(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoadingShift(true);
            await fetchActiveShift();
        };

        init();
    }, [authData?.token]);

    useEffect(() => {
        console.log("ACTIVE SHIFT CONTEXT:", activeShift);
    }, [activeShift]);

    return (
        <ShiftContext.Provider
            value={{
                activeShift,
                setActiveShift,
                fetchActiveShift,
                loadingShift,
            }}
        >
            {children}
        </ShiftContext.Provider>
    );
};

export const useShift = () => useContext(ShiftContext);