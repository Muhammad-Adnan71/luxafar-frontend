"use client";

import useElementVisibility from "@template-components/scrollPosition";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import compassCover from "@public/template/compasscover.png";
import compass from "@public/template/compass.png";

function Compass() {
  const ref = useRef(null);
  const isVisible = useElementVisibility(ref);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) setShowAnimation(isVisible);
  }, [isVisible]);

  return (
    <div className="relative sm:hidden w-[95%] ">
      <Image
        id="rotate_image"
        className={`
                   ${
                     showAnimation
                       ? "animate-[3s_compassOuterSpin_ease-in-out_none]"
                       : ""
                   }`}
        style={{
          transform: `rotateY(${1620 * 180}deg)`,
          position: "relative",
          transitionDuration: "0.6s",
        }}
        src={compassCover}
        alt="compass"
      />
      <div className="absolute w-[32%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <Image
          className={"animate-[80s_compassSpin_linear_infinite]"}
          src={compass}
          alt="Inner Compass"
        />
      </div>
    </div>
  );
}

export default Compass;
