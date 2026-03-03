import { useState } from "react";
import { Bitcoin } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { ConfirmSignUpForm } from "./ConfirmSignUpForm";

type AuthView = "signIn" | "signUp" | "confirmSignUp";

export function AuthPage() {
  const [view, setView] = useState<AuthView>("signIn");
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const handleSignUpSuccess = (email: string) => {
    setPendingEmail(email);
    setView("confirmSignUp");
  };

  const handleConfirmSuccess = () => {
    setView("signIn");
  };

  return (
    <div className="flex min-h-screen items-center justify-center  from-muted/40 to-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bitcoin className="size-8" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            BTC Guess Game
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === "signIn" && "Sign in to your account"}
            {view === "signUp" && "Create your account"}
            {view === "confirmSignUp" && "Confirm your email"}
          </p>
        </div>

        {/* Auth Forms */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-lg">
          {view === "signIn" && (
            <SignInForm onSwitchToSignUp={() => setView("signUp")} />
          )}
          {view === "signUp" && (
            <SignUpForm
              onSwitchToSignIn={() => setView("signIn")}
              onSignUpSuccess={handleSignUpSuccess}
            />
          )}
          {view === "confirmSignUp" && (
            <ConfirmSignUpForm
              email={pendingEmail}
              onConfirmSuccess={handleConfirmSuccess}
              onBackToSignIn={() => setView("signIn")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
