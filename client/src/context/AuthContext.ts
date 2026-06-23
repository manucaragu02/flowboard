import { createContext } from "react";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    login: (accessToken: string, refreshToken: string, userId: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);