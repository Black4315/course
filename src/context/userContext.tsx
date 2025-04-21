"use client";
import React, { createContext, useContext, useState } from 'react';
interface User {
    id: number;
    username: string;
    email: string;
    progress: number;
    profilePicture: string;
    role: string;
    registeredAt: string;
    status: string;
}

interface UserContextType {
    user_data: User | null;
    setUser_data:React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user_data, setUser_data] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user_data, setUser_data }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};