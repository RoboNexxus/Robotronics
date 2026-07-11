export const ANIMATION_CONFIG = {
  spring: {
    bouncy: {
      stiffness: 300,
      damping: 20,
      mass: 0.8,
    },
  },
  duration: {
    fast: 200,   
    normal: 400,
    slow: 600,
  },
};

interface AnimationConfigOptions {
  respectMotionPreference?: boolean;
}

export function getAnimationConfig(options: AnimationConfigOptions = {}) {
  const { respectMotionPreference = true } = options;

  const reducedMotion =
    respectMotionPreference &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return {
      ...ANIMATION_CONFIG,
      duration: { fast: 0, normal: 0, slow: 0 },
    };
  }

  return ANIMATION_CONFIG;
}
