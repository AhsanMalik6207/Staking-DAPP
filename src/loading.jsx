import React, { useRef, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import { gsap } from "gsap";

const Loader = () => {
  const blue = useRef(null);
  const red = useRef(null);
  const yellow = useRef(null);
  const green = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      [blue.current, yellow.current],
      0.5,
      { y: 18 },
      { y: -18, yoyo: true, repeat: -1 }
    );
    gsap.fromTo(
      [red.current, green.current],
      0.5,
      { y: -18 },
      { y: 18, repeat: -1, yoyo: true }
    );
  }, []);
  return (
    <svg viewBox="0 0 150 33.2" width="150" height="300">
      <circle ref={blue} cx="16.1" cy="16.6" r="16.1" fill="#28a745" />
      <circle ref={red} cx="55.2" cy="16.6" r="16.1" fill="#668056" />
      <circle ref={yellow} cx="94.3" cy="16.6" r="16.1" fill="#328767" />
      <circle ref={green} cx="133.4" cy="16.6" r="16.1" fill="#F7C35F" />
    </svg>
  );
};

export default function Loading({ loading }) {
  return (
    <div>
      <Backdrop style={{ zIndex: "220000000" }} open={loading}>
        <Loader />
      </Backdrop>
    </div>
  );
}
