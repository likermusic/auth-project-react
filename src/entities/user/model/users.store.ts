import { create } from "zustand";

interface UserData {
  id: string | null;
  login: string | null;
}
interface UserState extends UserData {
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  login: null,
  setUser: (user) => {
    if (user?.id !== null && user?.login !== null) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ id: user.id, login: user.login });
    }
    // set({ id: user?.id ?? null, login: user?.login ?? null });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ id: null, login: null });
  },
}));
