import React, { ComponentType } from "react";
import { api } from "../api/axios-instance";

export function withCheckAuth<T extends ComponentType>(
  Component: ComponentType<T>
) {
  return function (props: T) {
    api.get("/session").then((resp) => console.log(resp));

    return <Component {...props} />;
  };
}
