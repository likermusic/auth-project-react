import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { api } from "../api/axios-instance";

export function withCheckAuth<T>(Component: (props: T) => ReactElement) {
  return function (props: PropsWithChildren<T>) {
    useEffect(() => {
      api.get("/session").then((resp) => console.log(resp));
    }, []);

    return <Component {...props} />;
  };
}
