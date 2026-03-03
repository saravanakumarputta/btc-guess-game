import { useState, type FormEvent } from "react";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../model/AuthContext";
import { Button } from "@/components/ui/button";

interface ConfirmSignUpFormProps {
  email: string;
  onConfirmSuccess: () => void;
  onBackToSignIn: () => void;
}

export function ConfirmSignUpForm({
  email,
  onConfirmSuccess,
  onBackToSignIn,
}: ConfirmSignUpFormProps) {
  const { confirmSignUp, resendCode, error, clearError } = useAuth();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      await confirmSignUp({ email, code });
      onConfirmSuccess();
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    clearError();
    setIsResending(true);
    setResendSuccess(false);

    try {
      await resendCode(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error("Resend error:", err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
        <p className="text-foreground">
          We've sent a confirmation code to{" "}
          <span className="font-medium">{email}</span>
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Please check your email and enter the code below.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {resendSuccess && (
        <div className="flex items-start gap-2 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-700 dark:text-green-400">
          <Mail className="size-4 shrink-0 mt-0.5" />
          <span>Code sent successfully!</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="code"
          className="block text-sm font-medium text-foreground"
        >
          Confirmation Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          required
          maxLength={6}
          className="w-full rounded-lg border border-border bg-background py-2 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center font-mono text-lg tracking-widest"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Confirming...
          </>
        ) : (
          "Confirm Email"
        )}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={isResending}
          variant="ghost"
          size="sm"
        >
          {isResending ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend code"
          )}
        </Button>

        <Button
          type="button"
          onClick={onBackToSignIn}
          variant="ghost"
          size="sm"
        >
          Back to sign in
        </Button>
      </div>
    </form>
  );
}
