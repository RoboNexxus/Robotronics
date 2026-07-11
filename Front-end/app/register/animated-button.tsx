"use client";

import React, { useRef, useEffect } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ANIMATION_CONFIG, getAnimationConfig } from "@/lib/animation-config";
import { useWillChange } from "@/lib/animation-utils";

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    children?: React.ReactNode;
    as?: any;
  };

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Browse Components",
  className = "",
  as = "button",
  ...rest
}) => {
  const Component = (motion as any)[as] || motion.button;
  const buttonRef = useRef<HTMLElement>(null);
  
  const config = getAnimationConfig({ respectMotionPreference: true });
  
  useWillChange(buttonRef, ['transform']);

  return (
    <Component
      ref={buttonRef}
      {...rest}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        ...ANIMATION_CONFIG.spring.bouncy,
      }}
      className={cn(
        "group inline-flex items-center justify-center px-6 py-2 rounded-md relative overflow-hidden bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-[#222]",
        "text-neutral-900 dark:text-neutral-100 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50",
        "[--shine:rgba(0,0,0,.66)] dark:[--shine:rgba(255,255,255,.66)]",
        className,
      )}
    >
      <motion.span
        className="tracking-wide font-light flex items-center justify-center h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ ["--mask-x" as any]: "100%" } as any}
        animate={{ ["--mask-x" as any]: "-100%" } as any}
        transition={{
          repeat: Infinity,
          duration: config.duration.fast / 200, 
          ease: "linear",
          repeatDelay: config.duration.fast / 200, 
        }}
      >
        {children}
      </motion.span>

      <motion.span
        className="block absolute inset-0 rounded-md p-px"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{
          duration: config.duration.fast / 200, 
          repeat: Infinity,
          ease: "linear",
          repeatDelay: config.duration.fast / 200, 
        }}
      />
    </Component>
  );
};

export default AnimatedButton;
