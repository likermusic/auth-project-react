// import { UiHeader } from "@/shared/ui/ui-header";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { Outlet } from "react-router-dom";
// import { NavLinks } from "./nav-links";
// import { Profile } from "./profile";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      ROOT LAYOUT
      {/* <UiHeader links={<NavLinks />} right={<Profile />} /> */}
      <main className="grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

const ProtectedRootLayout = withCheckAuth(RootLayout);
export { ProtectedRootLayout };
