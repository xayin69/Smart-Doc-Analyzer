import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, checkAuth, authChecked } = useAuthStore();

  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, checkAuth]);

  if (!authChecked) {
    return <div className="p-6">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
