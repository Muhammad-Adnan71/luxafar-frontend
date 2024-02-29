import Script from "next/script";
import React from "react";

function Gtagm() {
  return (
    <>
      <Script
        async={true}
        defer={true}
        src="https://www.googletagmanager.com/gtag/js?id=G-WFE10W6S7Y"
      />
      <Script async={true} defer={true} id="G-WFE10W6S7Y">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WFE10W6S7Y')
          `}
      </Script>
    </>
  );
}

export default Gtagm;
