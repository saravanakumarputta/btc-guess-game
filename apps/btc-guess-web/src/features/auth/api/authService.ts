import {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
  resendSignUpCode,
  type SignUpInput,
  type SignInInput,
  type ConfirmSignUpInput,
} from "aws-amplify/auth";
import type {
  User,
  SignUpParams,
  SignInParams,
  ConfirmSignUpParams,
} from "../model/types";

export async function authSignUp({ email, password }: SignUpParams) {
  const input: SignUpInput = {
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
      autoSignIn: true,
    },
  };

  const { isSignUpComplete, userId, nextStep } = await signUp(input);

  return {
    isSignUpComplete,
    userId,
    nextStep,
  };
}

export async function authConfirmSignUp({ email, code }: ConfirmSignUpParams) {
  const input: ConfirmSignUpInput = {
    username: email,
    confirmationCode: code,
  };

  const { isSignUpComplete, nextStep } = await confirmSignUp(input);

  return {
    isSignUpComplete,
    nextStep,
  };
}

export async function authResendSignUpCode(email: string) {
  await resendSignUpCode({ username: email });
}

export async function authSignIn({ email, password }: SignInParams) {
  const input: SignInInput = {
    username: email,
    password,
  };

  const { isSignedIn, nextStep } = await signIn(input);

  return {
    isSignedIn,
    nextStep,
  };
}

export async function authSignOut() {
  await signOut();
}

export async function authGetCurrentUser(): Promise<User | null> {
  try {
    const { username, userId } = await getCurrentUser();
    const { tokens } = await fetchAuthSession();

    const email = tokens?.idToken?.payload.email as string;
    const emailVerified = tokens?.idToken?.payload.email_verified as boolean;

    return {
      userId: userId || username,
      email: email || username,
      emailVerified: emailVerified || false,
    };
  } catch (error: any) {
    console.error("Failed to get current user:", error);
    throw error;
  }
}
