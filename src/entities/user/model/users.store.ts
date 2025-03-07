import { create } from "zustand";
import { authApi } from "../api/auth-api";

interface UserData {
  id: string | null;
  login: string | null;
}
interface UserState {
  user: UserData;
  error: boolean;
  loading: boolean;
  setUser: (user: UserData) => void;
  clearUser: () => void;
  getUserSession: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: null,
    login: null,
  },
  error: false,
  loading: true,
  setUser: (user) => {
    if (user?.id !== null && user?.login !== null) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    }
    // set({ id: user?.id ?? null, login: user?.login ?? null });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: { id: null, login: null } });
  },
  getUserSession: async () => {
    try {
      set({ error: false });
      set({ loading: true });
      // await new Promise<void>((res) =>
      //   setTimeout(() => {
      //     res();
      //   }, 4000)
      // );
      const resp = await authApi.session();
      void (resp?.data && set({ user: resp.data }));
    } catch {
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
