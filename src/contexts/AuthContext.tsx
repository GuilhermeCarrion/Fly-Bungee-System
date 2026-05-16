import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";

/**
 * creatContext: Conteiner de contexto.
 * useCallBack: Memoriza funções para evitar que sejam recriadas.
 * useContext: Permite qua um componente consuma o contexto.
 * useEffect: Dispara efeitos colaterais (carregar dados para montar componente).
 * useState: Gerencia estado local (user, loading, isAuthenticated).
 * ReactNode: Tipo que representa qualquer conteudo renderizável (filhos do provider).
 */

interface User {
  id: string;
  email: string;
  name?: string;
}

// Estrutura do objeto usuário
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  /**
   * user: guarda os dados do usuário logado ou null.
   * isAuthenticated: flag booleana que indica se há sessão ativa.
   * loading: começa como true e só vai para false após verificar token no localStorage. Evita que a tela de login pisque antes da verificação.
   */

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const token = localStorage.getItem("@App:token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await api.get<User>("/me");
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading token:", error);
        localStorage.removeItem("@App:token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };
    loadStoredToken();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>("/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("@App:token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@App:token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
