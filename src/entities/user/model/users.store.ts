import { create } from "zustand";
import { authApi } from "../api/auth-api";
import { useNavigate } from "react-router-dom";

interface IUser {
  id: string | null;
  login: string | null;
}

interface UserState {
  user: IUser;
  error: boolean;
  loading: boolean;
  signoutError: boolean;
  signoutLoading: boolean;
  // setUser: (user: IUser) => void;
  signout: () => Promise<boolean>;
  getUserSession: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: null,
    login: null,
  },
  error: false,
  loading: false,

  signoutError: false,
  signoutLoading: false,

  // setUser: (user) => {
  //   if (user?.id !== null && user?.login !== null) {
  //     set({ user });
  //   }
  //   // set({ id: user?.id ?? null, login: user?.login ?? null });
  // },

  signout: async () => {
    try {
      set({ signoutError: false, signoutLoading: true });
      await authApi.signout();
      set({ user: { id: null, login: null } });
      return true;
    } catch {
      set({ signoutError: true });
      return false;
    } finally {
      set({ signoutLoading: false });
    }
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
