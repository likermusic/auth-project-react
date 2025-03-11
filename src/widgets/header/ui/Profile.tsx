import { useUserStore } from "@/entities/user";
import { SignOutButton } from "@/features/auth";

export function Profile() {
  const profile = useUserStore((state) => state.user);

  return (
    <div className="flex gap-2 items-center">
      <span>{profile?.id}</span>
      <span>{profile?.login}</span>
      <SignOutButton />
    </div>
  );
}
