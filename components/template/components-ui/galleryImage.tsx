import React, { useState } from "react";

function GalleryImage({ url }: { url: string }) {
  const doesImageExist = (url: any) =>
    new Promise((resolve) => {
      const img = new Image();

      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  const [imageLoading, setImageLoading] = useState<any>(true);
  return (
    <>
      {imageLoading ? (
        <>
          <div className="w-full border border-[rgba(255,255,255,0.18)] h-full glass-effect">
            <span></span>
            <span></span>
          </div>
        </>
      ) : (
        ""
      )}
      <img
        loading="lazy"
        className="w-full h-full object-cover"
        src={url}
        alt=""
        onLoad={async () => {
          const response = await doesImageExist(url);
          setImageLoading(false);
        }}
      />
    </>
  );
}

export default GalleryImage;
