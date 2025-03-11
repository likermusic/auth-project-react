// import { UiHeader } from "@/shared/ui/ui-header";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { Header } from "@/widgets/header";
import { Outlet } from "react-router-dom";
// import { NavLinks } from "./nav-links";
// import { Profile } from "./profile";

function AppLayout() {
  return (
    <div className="flex flex-col">
      <Header />

      {/* <UiHeader links={<NavLinks />} right={<Profile />} /> */}
      <main className="grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

const ProtectedAppLayout = withCheckAuth(AppLayout);
export { ProtectedAppLayout };
