import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiPrivate, apiPublic } from "@/lib/axios";

/**
 * creatContext: Conteiner de contexto.
 *
 * useCallBack: Memoriza funções para evitar que sejam recriadas.
 *
 * useContext: Permite qua um componente consuma o contexto.
 *
 * useEffect: Dispara efeitos colaterais (carregar dados para montar componente).
 *
 * useState: Gerencia estado local (user, loading, isAuthenticated).
 *
 * ReactNode: Tipo que representa qualquer conteudo renderizável (filhos do provider).
 */

interface User {
  id: string;
  email: string;
  name?: string;
}

// Estrutura do objeto contexto
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

  // Executa uma unica vez quando o Provider é montado (Array de dependencias vazio)
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const token = localStorage.getItem("@App:token");
        if (token) {
          apiPrivate.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;
          const response = await apiPrivate.get<User>("/auth/me");
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading token:", error);
        localStorage.removeItem("@App:token");
        delete apiPrivate.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };
    loadStoredToken();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiPublic.post<{ token: string; user: User }>(
        "/auth/login",
        {
          email,
          password,
        },
      );
      const { token, user } = response.data;

      localStorage.setItem("@App:token", token);
      apiPublic.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@App:token");
    delete apiPrivate.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Disponibilizando os valores e funções para todos os componentes filhos. Value é o objeto que qualquer consumidor
  // do contexto receberá ao chamar useAuth()
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

/**
 * Encapsula o acesso ao contexto, se algum componente tentar usar useAuth sem estar dentro de AuthProvider,
 * o erro será lançado com uma mensagem clara.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
