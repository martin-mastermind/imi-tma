"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import WebApp from "@twa-dev/sdk";

export default function TelegramChrome() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  useEffect(() => {
    const back = WebApp.BackButton;
    const handler = () => {
      if (pathname === "/result") router.push("/generator");
      else if (pathname === "/generator") router.push("/");
      else router.back();
    };

    if (pathname === "/") {
      back.hide();
      return;
    }

    back.show();
    back.onClick(handler);
    return () => {
      back.offClick(handler);
    };
  }, [pathname, router]);

  return null;
}
