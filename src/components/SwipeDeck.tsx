import { useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import type { Apartment, SwipeDirection } from "../types";
import ApartmentCard from "./ApartmentCard";

const SWIPE_THRESHOLD = 120;

interface Props {
  apartments: Apartment[];
  onSwipe: (apartment: Apartment, direction: SwipeDirection) => void;
}

function TopCard({
  apartment,
  onSwipe,
}: {
  apartment: Apartment;
  onSwipe: (direction: SwipeDirection) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const controls = useAnimation();
  const [locked, setLocked] = useState(false);

  const fly = async (direction: SwipeDirection) => {
    if (locked) return;
    setLocked(true);
    await controls.start({
      x: direction === "right" ? 600 : -600,
      rotate: direction === "right" ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    });
    onSwipe(direction);
  };

  return (
    <motion.div
      className="swipe-card-outer"
      style={{ x, rotate }}
      animate={controls}
      drag="x"
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) {
          fly("right");
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
          fly("left");
        }
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.div className="stamp stamp-like" style={{ opacity: likeOpacity }}>
        НРАВИТСЯ
      </motion.div>
      <motion.div className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>
        МИМО
      </motion.div>
      <ApartmentCard apartment={apartment} active />
    </motion.div>
  );
}

export default function SwipeDeck({ apartments, onSwipe }: Props) {
  const visible = apartments.slice(0, 3);

  return (
    <div className="swipe-deck">
      {visible
        .slice()
        .reverse()
        .map((apt, revIdx) => {
          const idx = visible.length - 1 - revIdx;
          const isTop = idx === 0;
          if (isTop) {
            return (
              <TopCard
                key={apt.id}
                apartment={apt}
                onSwipe={(direction) => onSwipe(apt, direction)}
              />
            );
          }
          return (
            <div
              key={apt.id}
              className="swipe-card-outer stacked"
              style={{
                transform: `scale(${1 - idx * 0.04}) translateY(${idx * 10}px)`,
                zIndex: -idx,
              }}
            >
              <ApartmentCard apartment={apt} active={false} />
            </div>
          );
        })}
    </div>
  );
}
