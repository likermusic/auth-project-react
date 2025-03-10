import { authApi, useUserStore } from "@/entities/user";

export function useSignOutUser() {
  const signout = useUserStore(state => state.signout);
  const loading = useUserStore(state => state.loading);
  const error = useUserStore(state => state.error);

  async function signOutHandler() {
    try {
      const resp = await authApi.signout();
      if (resp?.statusText === "OK") {
        console.log("sds");
      }
      resp.statusText === "OK" ? 
      // void (
      //   resp?.data?.token &&
      //   Cookies.set("token", resp.data.token, {
      //     expires: 1 / 24, // по дефолту в днях. Чтобы задать 1ч = 1/24
      //   })
      // );
      // toast.success("Вы зарегистрированы");

      // navigate("/");
    } catch (error) {
      // console.log((error as AxiosError).response?.data);

      console.log((error as AxiosError<{ error: string }>).response?.data);

      // console.log(error.response.data.error);

      // console.log((error as Error).message);
      toast.error(
        (error as AxiosError<{ error: string }>).response?.data?.error ||
          "Ошибка регистрации. Проверьте логин и пароль."
      );
    }
  }

  return { signOutHandler };
}
