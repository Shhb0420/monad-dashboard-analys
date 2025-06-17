import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const MonadTruck = ({ blockData }) => {
  const controls = useAnimation();
  const progressControls = useAnimation();

  useEffect(() => {
    const animateTruck = async () => {
      // 1. Truck arrives
      await controls.start({ 
        x: 0,
        transition: { type: "spring", stiffness: 100 }
      });

      // 2. Loading progress
      await progressControls.start({
        width: "100%",
        transition: { duration: 5, ease: "linear" }
      });

      // 3. Truck departs
      await controls.start({ 
        x: "100vw",
        transition: { duration: 3, ease: "easeInOut" }
      });

      // Reset for next animation
      await Promise.all([
        controls.start({ x: "-150px" }),
        progressControls.start({ width: "0%" })
      ]);
    };

    animateTruck();
  }, [blockData]);

  return (
    <div className="truck-container">
      <motion.div
        className="truck"
        initial={{ x: -150 }}
        animate={controls}
      >
        🚛
        <div className="cargo">
          {blockData.transactions.slice(0, 5).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="tx-cube"
            />
          ))}
        </div>
      </motion.div>

      <div className="progress-bar">
        <motion.div 
          className="progress-fill"
          initial={{ width: 0 }}
          animate={progressControls}
        />
      </div>
    </div>
  );
};

export default MonadTruck;