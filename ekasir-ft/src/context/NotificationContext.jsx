import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const MAX_NOTIFICATIONS = 50;

export const NotificationProvider = ({ children }) => {

    const { authData } = useAuth();
    const role = authData?.role;

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("notifications")) || [];
            setNotifications(saved);
        } catch {
            setNotifications([]);
        }
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const saved = JSON.parse(localStorage.getItem("notifications")) || [];
            setNotifications(saved);
        };

        window.addEventListener("storage", handleStorage);

        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const save = (data) => {
        setNotifications(data);
        localStorage.setItem("notifications", JSON.stringify(data));
    };

    const pushNotification = (notif) => {

        setNotifications(prev => {

            const updated = [
                {
                    id: Date.now() + Math.random(),
                    read: false,
                    createdAt: new Date().toISOString(),
                    ...notif
                },
                ...prev
            ].slice(0, MAX_NOTIFICATIONS);

            localStorage.setItem("notifications", JSON.stringify(updated));

            return updated;
        });

    };

    // FILTER BERDASARKAN ROLE
    const filteredNotifications = notifications.filter(n =>
        !n.role || n.role.includes(role)
    );

    const unreadCount = filteredNotifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        save(updated);
    };

    const markAsRead = (id) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        save(updated);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications: filteredNotifications,
                unreadCount,
                pushNotification,
                markAllAsRead,
                markAsRead
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);