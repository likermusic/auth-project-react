import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { useUserStore } from "@/entities/user";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/shared/ui/spinner";

export function withCheckAuth<T>(Component: (props: T) => ReactElement) {
  return function (props: PropsWithChildren<T>) {
    const navigate = useNavigate();

    const error = useUserStore((state) => state.error);
    const loading = useUserStore((state) => state.loading);

    const getUserSession = useUserStore((state) => state.getUserSession);

    useEffect(() => {
      getUserSession();
    }, []);

    if (error) {
      navigate("/signin");
      return null;
    }
    if (loading)
      return (
        <div className="min-h-screen flex justify-center align-center">
          <Spinner size={"large"} className="text-black" />
        </div>
      );
    return <Component {...props} />;
  };
}
