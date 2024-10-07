"use client";
import Lottie from "lottie-react";
import Ellipsis from "./ellipsis.json";

const LoadingEllipsis = () => {
  return (
    <Lottie
      style={{
        width: 100,
        color: "white",
      }}
      animationData={Ellipsis}
    />
  );
};

export default LoadingEllipsis;
