
import { useAuth } from "@/contexts/AuthContext";

export function useSmartNavigation() {
  const { user } = useAuth();

  const handleRequestNurse = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/sign-up";
    }
  };

  const handleJoinAsNurse = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/sign-up";
    }
  };

  return { handleRequestNurse, handleJoinAsNurse };
}
