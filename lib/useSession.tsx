import { useEffect } from "react";
import { apiGetAuthUser } from "services/auth";
import useAuthStore from "store/useAuthUser";

export default function useSession() {
  const store = useAuthStore();

  async function fetchUser() {
    try {
      const user = await apiGetAuthUser();
      store.setAuthUser(user);
    } catch (error: any) {
      store.reset();
    }
  }

  useEffect(() => {
    if (!store.authUser) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store.authUser;
}
