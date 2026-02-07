import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const load = () => {
        const saved = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(saved);
    };

    useEffect(() => {
        load();
    }, []);

    const pushNotification = (notif) => {
        const updated = [
            {
                id: Date.now(),
                read: false,
                createdAt: new Date().toISOString(),
                ...notif,
            },
            ...notifications,
        ];

        setNotifications(updated);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };

    const markAsRead = (id) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                pushNotification,
                markAllAsRead,
                markAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
