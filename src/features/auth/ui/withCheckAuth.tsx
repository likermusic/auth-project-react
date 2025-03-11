import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { useUserStore } from "@/entities/user";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/shared/ui/spinner";
import { ROUTES } from "@/shared/constants/routes";

/** Для страниц входа проверка */

export function withCheckAuth<T>(Component: (props: T) => ReactElement) {
  return function (props: PropsWithChildren<T>) {
    const navigate = useNavigate();

    const error = useUserStore((state) => state.sessionError);
    const loading = useUserStore((state) => state.sessionLoading);

    const getUserSession = useUserStore((state) => state.getUserSession);

    useEffect(() => {
      (async function () {
        const session = await getUserSession();
        if (session) {
          navigate(ROUTES.HOME);
          return;
        }
      })();
    }, [getUserSession, navigate]);

    if (loading)
      return (
        <div className="min-h-screen flex justify-center align-center">
          <Spinner size={"large"} className="text-black" />
        </div>
      );
    if (error && !loading) {
      return <Component {...props} />;
    }
  };
}

/* ** Для главной проверка
export function withCheckAuth<T>(Component: (props: T) => ReactElement) {
  return function (props: PropsWithChildren<T>) {
    const navigate = useNavigate();

    const error = useUserStore((state) => state.sessionError);
    const loading = useUserStore((state) => state.sessionLoading);

    const getUserSession = useUserStore((state) => state.getUserSession);

    useEffect(() => {
      getUserSession();
    }, [getUserSession]);

    useEffect(() => {
      if (error) {
        navigate("/signin");
      }
    }, [error, navigate]);

    if (loading)
      return (
        <div className="min-h-screen flex justify-center align-center">
          <Spinner size={"large"} className="text-black" />
        </div>
      );
    if (error) {
      return null;
    }
    return <Component {...props} />;
  };
}
*/
