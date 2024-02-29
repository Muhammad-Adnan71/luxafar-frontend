"use client";
import React from "react";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () =>
    import("components/CMS/components-ui/shadcn/ui/toaster").then(
      (res) => res.Toaster
    ),
  { ssr: false }
);
const CssImports = dynamic(() => import("../css-imports"), { ssr: false });
const Gtagm = dynamic(() => import("../gtagm"), { ssr: false });
const GoogleReCaptchaProvider = dynamic(
  () =>
    import("lib/google-recaptcha").then((res) => res.GoogleReCaptchaProvider),
  { ssr: false }
);
function Layout({ children }: { children: any }) {
  return (
    <div className="h-screen">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY as string}
        scriptProps={{
          async: true, // optional, default to false,
          defer: true, // optional, default to false
          appendTo: "head", // optional, default to "head", can be "head" or "body",
          nonce: undefined,
        }}
      >
        <Toaster />
        <CssImports />
        <Gtagm />
        {children}
      </GoogleReCaptchaProvider>
    </div>
  );
}

export default Layout;
