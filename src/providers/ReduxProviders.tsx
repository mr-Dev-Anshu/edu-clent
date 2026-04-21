"use client";
import { useEffect, useState } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { Provider } from "react-redux";

const GlobalLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-white z-[9999]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022448]"></div>
  </div>
);

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Server-side par loader dikhane ki zarurat nahi, hydration flicker avoid karein
  if (!mounted) return <GlobalLoader />;

  return (
    <Provider store={store}>
      <PersistGate loading={<GlobalLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}