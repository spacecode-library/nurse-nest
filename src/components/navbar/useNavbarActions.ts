
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useNavbarActions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApplyNowClick = () => {
    if (!user) {
      navigate("/auth", {
        state: {
          redirectAfterAuth: "https://www.nursenest.us/nurseapplication",
        },
      });
    } else {
      window.location.href = "https://www.nursenest.us/nurseapplication";
    }
  };

  const handleRequestNurseClick = () => {
    navigate("/apply");
  };

  return { handleApplyNowClick, handleRequestNurseClick };
}
