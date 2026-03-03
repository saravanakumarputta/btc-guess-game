import { Loader2 } from "lucide-react";
import { HomePage } from "@/pages/home";
import { AuthPage, useAuth } from "@/features/auth";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center from-muted/40 to-background">
        <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return isAuthenticated ? <HomePage /> : <AuthPage />;
}
