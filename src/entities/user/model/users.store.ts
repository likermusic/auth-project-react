import { create } from "zustand";
import { authApi, FormData } from "../api/auth-api";

interface IUser {
  id: number | null;
  login: string | null;
}

interface UserState {
  user: IUser;
  error: boolean;
  loading: boolean;
  signoutError: boolean;
  signoutLoading: boolean;
  signinError: boolean;
  signinLoading: boolean;
  signupError: boolean;
  signupLoading: boolean;
  // setUser: (user: IUser) => void;
  signout: () => Promise<boolean>;
  signin: (data: FormData) => Promise<boolean>;
  signup: (data: FormData) => Promise<boolean>;
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

  signinError: false,
  signinLoading: false,

  signupError: false,
  signupLoading: false,
  // setUser: (user) => {
  //   if (user?.id !== null && user?.login !== null) {
  //     set({ user });
  //   }
  //   // set({ id: user?.id ?? null, login: user?.login ?? null });
  // },
  signup: async (data: FormData) => {
    try {
      set({ signupError: false, signupLoading: true });
      const resp = await authApi.signup(data);
      set({ user: { id: resp.data.id, login: resp.data.login } });
      return true;
    } catch {
      set({ signupError: true });
      return false;
    } finally {
      set({ signupLoading: false });
    }
  },
  signin: async (data: FormData) => {
    try {
      set({ signinError: false, signinLoading: true });
      const resp = await authApi.signin(data);
      set({ user: { id: resp.data.id, login: resp.data.login } });
      return true;
    } catch {
      set({ signinError: true });
      return false;
    } finally {
      set({ signinLoading: false });
    }
  },
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
