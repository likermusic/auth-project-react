import { create } from "zustand";
import { authApi, FormData } from "../api/auth-api";

interface IUser {
  id: number | null;
  login: string | null;
}

interface UserState {
  user: IUser;
  sessionError: boolean;
  sessionLoading: boolean;
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
  getUserSession: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: {
    id: null,
    login: null,
  },
  sessionError: false,
  //изначально ставим true а то будет моргание главной стр когда юзер не авторизован
  sessionLoading: true,

  signoutError: false,
  signoutLoading: false,

  signinError: false,
  signinLoading: false,

  signupError: false,
  signupLoading: false,

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
      set({ sessionError: false, sessionLoading: true });
      // await new Promise<void>((res) =>
      //   setTimeout(() => {
      //     res();
      //   }, 4000)
      // );
      // Не надо получать юзера если он уже в сторе есть
      if (get().user.id && get().user.login) return true;
      const resp = await authApi.session();
      if (resp?.data) {
        set({ user: resp.data });
        return true;
      } else {
        throw new Error();
      }
    } catch {
      set({ sessionError: true });
      return false;
    } finally {
      set({ sessionLoading: false });
    }
  },
}));
