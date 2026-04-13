"use client"; 
import { useEffect } from "react";
import ComponentShowcase from "@/common/components/shared/UseCase";
import LoginPage from "@/features/auth/components/LoginPage";

export default function Home() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length > 1) {
      const subdomain = parts[0];
      console.log("🚀 Current Tenant Subdomain:", subdomain);
    } else {
      console.log("🏠 No subdomain found (Main Domain)");
    }
  }, []);

  return (
    <div>
      <LoginPage/>
      {/* <ComponentShowcase /> */}
    </div>
  );
}
