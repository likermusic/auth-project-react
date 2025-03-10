import { Profile } from "./Profile";

export function Header() {
  return (
    <header
      className={
        "px-4 py-5  flex justify-between items-center bg-gray-950 text-white"
      }
    >
      LOGO
      <Profile />
    </header>
  );
}
