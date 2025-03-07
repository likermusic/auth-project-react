// import { UiHeader } from "@/shared/ui/ui-header";
import { User } from "@/entities/user";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { Button } from "@/shared/ui/button";
import { Outlet } from "react-router-dom";
// import { NavLinks } from "./nav-links";
// import { Profile } from "./profile";

function AppLayout({ profile }: { profile: User }) {
  return (
    <div className="flex flex-col">
      <header
        className={
          "px-4 py-5  flex justify-between items-center bg-gray-950 text-white"
        }
      >
        <span>{profile?.id}</span>
        <span>{profile?.login}</span>
        <Button>Выйти</Button>
        {/* <UiLogo />
        {right} */}
      </header>

      {/* <UiHeader links={<NavLinks />} right={<Profile />} /> */}
      <main className="grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

const ProtectedAppLayout = withCheckAuth(AppLayout);
export { ProtectedAppLayout };
