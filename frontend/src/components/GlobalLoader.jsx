import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { useLoader } from "../context/LoaderContext";
import "../styles/FlowerLoader.css";

const random = (min, max) => Math.random() * (max - min) + min;

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const GlobalLoader = () => {
  const { loading, text } = useLoader();

  if (!loading || prefersReducedMotion || text === "ROUTE_CHANGE") return null;

  const Petal = ({ type }) => {
    const controls = useAnimationControls();
    let isMounted = true;

    const startAnimation = async () => {
      if (!isMounted) return;

      const viewportHeight = window.innerHeight;

      const startX = isMobile
        ? random(10, window.innerWidth - 50)
        : random(0, 100);

      const startY = isMobile
        ? viewportHeight + random(40, 120) 
        : random(20, 90);

      const endY = isMobile
        ? -viewportHeight - 120 
        : random(-40, -20);

      const rotate = random(120, 220);
      const drift = random(4, 10);

      controls.set({
        x: isMobile ? `${startX}px` : `${startX}vw`,
        y: isMobile ? `${startY}px` : `${startY}vh`,
        rotate: 0,
      });

      await controls.start({
        x: isMobile
          ? `${startX}px`
          : [
            `${startX}vw`,
            `${startX + drift}vw`,
            `${startX - drift}vw`,
            `${startX}vw`,
          ],
        y: isMobile
          ? [`${startY}px`, `${endY}px`]
          : [`${startY}vh`, `${endY}vh`],
        rotate: isMobile ? 0 : [0, rotate],
        transition: {
          duration: isMobile
            ? type === "near"
              ? 34   
              : 48
            : type === "near"
              ? random(12, 16)
              : random(22, 30),
          ease: isMobile ? "easeOut" : "easeInOut",
        },
      });

      
      if (isMounted) {
        setTimeout(startAnimation, isMobile ? 1200 : 0);
      }
    };


    useEffect(() => {
      isMounted = true;
      startAnimation();

      return () => {
        isMounted = false;
      };
    }, []);

    return (
      <motion.span
        className={`petal petal-${type}`}
        initial={false}
        animate={controls}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          opacity: type === "near" ? 0.85 : 0.35,
          scale: isMobile
            ? type === "near"
              ? 0.85
              : 0.5
            : type === "near"
              ? random(0.7, 1)
              : random(0.4, 0.6),
        }}
      />
    );
  };

  const FAR_COUNT = isMobile ? 2 : 6;
  const NEAR_COUNT = isMobile ? 1 : 4;


  return (
    <div className="fixed inset-0 z-[9999] bg-[#FDFDFD] overflow-hidden">
      {/* FAR petals */}
      {Array.from({ length: FAR_COUNT }).map((_, i) => (
        <Petal key={`far-${i}`} type="far" />
      ))}

      {/* NEAR petals */}
      {Array.from({ length: NEAR_COUNT }).map((_, i) => (
        <Petal key={`near-${i}`} type="near" />
      ))}

      {/* Loader Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="premium-loader-container">
          <div className="spinner-orbit" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="minimal-text"
          >
            {text}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;