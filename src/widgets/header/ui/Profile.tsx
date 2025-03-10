import { useUserStore } from "@/entities/user";
import { Button } from "@/shared/ui/button";

export function Profile() {
  const profile = useUserStore((state) => state.user);

  return (
    <div className="flex gap-2 items-center">
      <span>{profile?.id}</span>
      <span>{profile?.login}</span>
      <Button className="cursor-pointer border border-slate">Выйти</Button>
    </div>
  );
}
