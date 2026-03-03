import { useState, type FormEvent } from "react";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../model/AuthContext";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSignUpSuccess: (email: string) => void;
}

export function SignUpForm({
  onSwitchToSignIn,
  onSignUpSuccess,
}: SignUpFormProps) {
  const { signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain a lowercase letter";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain an uppercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain a number";
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      return "Password must contain a special character";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({ email, password });
      onSignUpSuccess(email);
    } catch (err) {
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{displayError}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-foreground"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {password && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-medium text-foreground">
            Password requirements:
          </p>
          <ul className="space-y-1">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`size-3 shrink-0 ${
                    req.met ? "text-green-600" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={
                    req.met ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign up"
        )}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          onClick={onSwitchToSignIn}
          variant="ghost"
          size="sm"
        >
          Already have an account?{" "}
          <span className="font-medium text-primary">Sign in</span>
        </Button>
      </div>
    </form>
  );
}
