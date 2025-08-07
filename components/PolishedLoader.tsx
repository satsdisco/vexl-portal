'use client';

import { motion } from 'framer-motion';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface PolishedLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function PolishedLoader({ text = "Loading...", fullScreen = false }: PolishedLoaderProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: vexlBrand.colors.primary.yellow }}
            animate={{
              rotate: 360,
              transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          
          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-gray-700"
            animate={{
              rotate: -360,
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          
          {/* Center dot */}
          <motion.div
            className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full"
            style={{ backgroundColor: vexlBrand.colors.primary.yellow }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          
          {/* Network nodes */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: vexlBrand.colors.primary.yellow,
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px'
              }}
              animate={{
                x: Math.cos(angle * Math.PI / 180) * 40,
                y: Math.sin(angle * Math.PI / 180) * 40,
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="text-lg font-medium text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-600"
              animate={{
                backgroundColor: [
                  vexlBrand.colors.gray[600],
                  vexlBrand.colors.primary.yellow,
                  vexlBrand.colors.gray[600]
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}