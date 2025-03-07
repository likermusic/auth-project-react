import { withCheckAuth } from "@/shared/ui/withCheckAuth";
import { Home } from "./ui/Home";

const ProtectedHome = withCheckAuth(Home);
export { ProtectedHome };
