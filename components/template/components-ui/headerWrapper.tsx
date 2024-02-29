// import { pagesWithNoStickyHeader } from "lib/utils";
// import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
// import { useLocomotiveScroll } from "react-locomotive-scroll";

let oldScrollValue = 0;
function HeaderWrapper({ children }: { children: ReactNode }) {
  // const [isSticky, setIsSticky] = useState(false);
  // const { scroll } = useLocomotiveScroll();
  // const pathname = usePathname();
  // const [isPageWithStickyHeader, setIsPageWithStickyHeader] = useState(
  //   pagesWithNoStickyHeader.includes(pathname)
  // );
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollValue: any = scroll?.scroll?.instance?.scroll?.y;
  //     if (scrollValue >= 50 && oldScrollValue <= scrollValue) {
  //       if (oldScrollValue === 0 || oldScrollValue <= scrollValue) {
  //         setIsSticky(false);
  //       }
  //       oldScrollValue = scrollValue;
  //     } else {
  //       oldScrollValue = scrollValue;
  //       setIsSticky(true);
  //     }
  //   };
  //   if (!isMounted) {
  //     setIsSticky(true);
  //     setIsMounted(true);
  //   }
  //   scroll?.on("scroll", handleScroll);
  //   return () => {
  //     scroll?.off("scroll", handleScroll);
  //   };
  // }, [scroll?.scroll?.instance?.scroll?.y]);

  // useEffect(() => {
  //   setIsPageWithStickyHeader(pagesWithNoStickyHeader.includes(pathname));
  // }, [pathname]);

  return (
    <>
      {/* {isPageWithStickyHeader ? (
        <header
          data-scroll
          data-scroll-sticky
          data-scroll-class={isSticky ? "fadeIn" : "fadeOut"}
          data-scroll-repeat="true"
          data-scroll-target={"#header-container"}
          className={` max-sm:pb-8 pt-10 pb-14 max-sm:py-8 2xl:py-16 z-[52]  transition-colors `}
          // className={`sticky top-0 max-sm:pb-8 pt-10 pb-14 max-sm:py-8 2xl:py-16 z-[52]  transition-colors `}
        >
          {children}
        </header>
      ) : (
        <header
          className={` max-sm:pb-8 pt-10 pb-14 max-sm:py-8 2xl:py-16 z-[52] transition-colors relative `}
        >
          {children}
        </header>
      )} */}
      <header
        className={` max-sm:pb-8 pt-10 pb-14 max-sm:py-8 2xl:py-16 z-[52] transition-colors relative `}
      >
        {children}
      </header>
    </>
  );
}

export default HeaderWrapper;
