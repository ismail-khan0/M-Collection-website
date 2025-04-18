"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/authSlice";

function AuthInitializer() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      dispatch(loginSuccess({
        email: session.user.email,
        name: session.user.name
      }));
    } else if (status === 'unauthenticated') {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return null;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AuthInitializer />
        {children}
      </Provider>
    </SessionProvider>
  );
}