import { useUserStore } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SignOutButton() {
  const signout = useUserStore((state) => state.signout);
  const loading = useUserStore((state) => state.signoutLoading);
  // const error = useUserStore((state) => state.signoutError);
  const navigate = useNavigate();

  async function signoutHandler() {
    const resp = await signout();
    void (resp ? navigate("/signin") : toast.error("Ошибка"));
  }

  return (
    <>
      <Button
        onClick={signoutHandler}
        className="cursor-pointer border border-slate"
        disabled={loading}
      >
        Выйти
      </Button>
    </>
  );
}

export default SignOutButton;
