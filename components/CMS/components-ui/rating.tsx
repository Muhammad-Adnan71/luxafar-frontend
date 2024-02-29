import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import React from "react";
import { Rating as RatingSimple } from "react-simple-star-rating";

function Rating({
  rating,
  handleRating,
  size,
}: {
  rating: number;
  handleRating: any;
  size?: number;
}) {
  return (
    <RatingSimple
      readonly
      allowFraction
      size={size ? size : 15}
      className="mb-3"
      initialValue={4.5}
      fillColor="#A69769"
      iconsCount={5}
    />
  );
}

export default Rating;
