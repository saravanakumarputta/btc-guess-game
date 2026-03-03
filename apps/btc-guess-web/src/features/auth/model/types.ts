export interface User {
  userId: string;
  email: string;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  code: string;
}
