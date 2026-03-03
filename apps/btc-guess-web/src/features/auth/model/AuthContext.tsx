import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Hub } from "aws-amplify/utils";
import type {
  AuthState,
  SignUpParams,
  SignInParams,
  ConfirmSignUpParams,
} from "./types";
import {
  authSignUp,
  authSignIn,
  authSignOut,
  authGetCurrentUser,
  authConfirmSignUp,
  authResendSignUpCode,
} from "../api/authService";

interface AuthContextType extends AuthState {
  signUp: (params: SignUpParams) => Promise<{ userId?: string; nextStep: any }>;
  signIn: (params: SignInParams) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (params: ConfirmSignUpParams) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const loadUser = useCallback(async () => {
    try {
      const user = await authGetCurrentUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    loadUser();

    const hubListener = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          loadUser();
          break;
        case "signedOut":
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          break;
        case "tokenRefresh":
          loadUser();
          break;
        case "tokenRefresh_failure":
          setAuthState((prev) => ({
            ...prev,
            error: "Session expired. Please sign in again.",
          }));
          break;
      }
    });

    return () => hubListener();
  }, []);

  const signUp = async (params: SignUpParams) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await authSignUp(params);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign up";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const confirmSignUp = async (params: ConfirmSignUpParams) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authConfirmSignUp(params);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      const errorMessage = error.message || "Failed to confirm sign up";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const resendCode = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));
      await authResendSignUpCode(email);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to resend code";
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  };

  const signIn = async (params: SignInParams) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authSignIn(params);
      await loadUser();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authSignOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign out";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signUp,
        signIn,
        signOut,
        confirmSignUp,
        resendCode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
