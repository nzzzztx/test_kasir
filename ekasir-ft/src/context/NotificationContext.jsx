import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

const MAX_NOTIFICATIONS = 50;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(saved);
    }, []);

    const save = (data) => {
        setNotifications(data);
        localStorage.setItem("notifications", JSON.stringify(data));
    };

    const pushNotification = (notif) => {
        setNotifications((prev) => {
            const updated = [
                {
                    id: Date.now(),
                    read: false,
                    createdAt: new Date().toISOString(),
                    ...notif,
                },
                ...prev,
            ].slice(0, MAX_NOTIFICATIONS);

            localStorage.setItem("notifications", JSON.stringify(updated));

            return updated;
        });
    };

    const markAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        save(updated);
    };

    const markAsRead = (id) => {
        const updated = notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        save(updated);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

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