"use client";

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { LocomotiveScrollProvider as RLSProvider } from "react-locomotive-scroll";

import { usePathname } from "next/navigation";
// import ContactDrawer from "@template-components/drawers/contactDrawer";
import usePreloader from "store/usePreloader";
import dynamic from "next/dynamic";
const ContactDrawer = dynamic(
  () => import("@template-components/drawers/contactDrawer"),
  { ssr: false }
);
function RSLProvider({ children }: { children: any }) {
  const pathName = usePathname();
  const containerRef = useRef(null);
  const { isLoading, handleLoading } = usePreloader();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsHidden(false);
      }, 500);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleLoad = () => handleLoading();
    if (document.readyState === "complete") handleLoading();
    else window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  const classes = `leading-none overflow-hidden ${
    isHidden ? "h-screen " : "w-screen"
  }`;
  return (
    <RLSProvider
      options={{
        smooth: true,
      }}
      watch={[]}
      location={pathName}
      onLocationChange={(scroll: any) => {
        scroll.scrollTo(0, { duration: 0, disableLerp: true });
      }}
      containerRef={containerRef}
    >
      <main
        id="header-container"
        className={classes}
        data-scroll-container
        ref={containerRef}
      >
        {children}
      </main>
      <ContactDrawer />
    </RLSProvider>
  );
}

export default RSLProvider;
