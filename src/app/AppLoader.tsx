import { useUserStore } from "@/entities/user";
import { ROUTES } from "@/shared/constants/routes";
import { Spinner } from "@/shared/ui/spinner";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AppLoader({ children }: { children?: ReactNode }) {
  const getUserSession = useUserStore((state) => state.getUserSession);
  const loading = useUserStore((state) => state.sessionLoading);
  const error = useUserStore((state) => state.sessionError);

  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const session = await getUserSession();
      if (!session) {
        navigate(ROUTES.SIGNIN);
        return;
      }
    })();
  }, [getUserSession, navigate]);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center align-center">
        <Spinner size={"large"} className="text-black" />
      </div>
    );
  }
  if (error) return null;

  return children;
}
