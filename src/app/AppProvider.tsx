import { ReactNode } from "react";

export function AppProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
