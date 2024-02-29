/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";

function ImageWithLoader({ url, classes, loaderClasses, ...rest }: any) {
  const [imageLoading, setImageLoading] = useState<any>(true);

  const imgRef = useRef<any>();

  return (
    <>
      {imageLoading ? (
        <>
          <div className={"w-full h-full glass-effect " + loaderClasses}>
            <span></span>
            <span></span>
          </div>
        </>
      ) : (
        ""
      )}
      <img
        ref={imgRef}
        alt=""
        {...rest}
        src={url}
        className={`${classes} ${imageLoading ? "invisible" : ""}`}
        onLoad={() => setImageLoading(false)}
      />
    </>
  );
}

export default ImageWithLoader;
