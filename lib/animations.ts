import { vexlBrand } from './vexl-brand-manual';

// Framer Motion animation variants
export const animations = {
  // Page transitions
  pageIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: vexlBrand.animation.easing.inOut }
  },

  // Fade in animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, ease: vexlBrand.animation.easing.out }
  },

  // Slide animations
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, ease: vexlBrand.animation.easing.out }
  },

  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, ease: vexlBrand.animation.easing.out }
  },

  slideInFromBottom: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: vexlBrand.animation.easing.out }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },

  // Hero text animations
  heroTitle: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: vexlBrand.animation.easing.out
      }
    }
  },

  // Button hover effects
  buttonHover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },

  buttonTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },

  // Card animations
  cardHover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2, ease: vexlBrand.animation.easing.out }
  },

  // Glow effect
  glowPulse: {
    animate: {
      boxShadow: [
        `0 0 20px ${vexlBrand.colors.primary.yellow}40`,
        `0 0 40px ${vexlBrand.colors.primary.yellow}60`,
        `0 0 20px ${vexlBrand.colors.primary.yellow}40`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Floating animation
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Bounce animation
  bounce: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: vexlBrand.animation.easing.bounce
      }
    }
  },

  // Network effect animation
  networkPulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Loading spinner
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // Success checkmark
  checkmark: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: vexlBrand.animation.easing.out
      }
    }
  }
};

// Interaction animations
export const interactions = {
  // Ripple effect on click
  ripple: {
    initial: { scale: 0, opacity: 1 },
    animate: { scale: 4, opacity: 0 },
    transition: { duration: 0.6 }
  },

  // Text highlight
  highlight: {
    initial: { backgroundSize: '0% 100%' },
    animate: { backgroundSize: '100% 100%' },
    transition: { duration: 0.3 }
  }
};

// Page transition wrapper
export const pageTransition = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: animations.pageIn
};

// Hover and tap animations for interactive elements
export const interactiveElement = {
  whileHover: animations.buttonHover,
  whileTap: animations.buttonTap
};