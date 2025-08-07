'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface PhoneMockupProps {
  screenshots?: string[];
  title?: string;
  description?: string;
  showNotification?: boolean;
  notificationText?: string;
  className?: string;
  animate?: boolean;
}

export default function PolishedPhoneMockup({
  screenshots = [],
  title,
  description,
  showNotification = false,
  notificationText = "New offer from your network",
  className = "",
  animate = true
}: PhoneMockupProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <motion.div
        className="relative mx-auto"
        style={{ width: '320px', height: '640px' }}
        initial={animate ? { scale: 0.9, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Phone Shell */}
        <div 
          className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-gray-900 to-gray-800"
          style={{
            boxShadow: `
              0 0 0 12px ${vexlBrand.colors.gray[950]},
              0 0 0 14px ${vexlBrand.colors.gray[800]},
              0 20px 40px rgba(0, 0, 0, 0.4)
            `
          }}
        >
          {/* Screen Area */}
          <div className="absolute inset-[12px] rounded-[2.5rem] overflow-hidden bg-black">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-8 pt-2">
              <div className="flex items-center gap-1">
                <div className="text-white text-xs font-medium">9:41</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-3 border border-white/60 rounded-sm">
                  <div className="w-full h-full bg-white rounded-sm scale-75 origin-left"></div>
                </div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>

            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30"></div>

            {/* Content Area */}
            <div className="relative w-full h-full bg-black">
              {screenshots.length > 0 ? (
                <div className="relative w-full h-full">
                  {screenshots.map((src, index) => (
                    <motion.div
                      key={src}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: index === currentScreenshot ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image 
                        src={src} 
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  {/* Vexl App Preview */}
                  <div className="w-full">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}></div>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}></div>
                        <span className="font-black text-lg" style={{ color: vexlBrand.colors.primary.yellow }}>vexl</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-800"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-800"></div>
                      </div>
                    </div>

                    {/* Offer Cards */}
                    <div className="space-y-3">
                      <motion.div 
                        className="bg-gray-900 rounded-xl p-4 border border-gray-800"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                            <div>
                              <div className="text-white text-sm font-semibold">Friend of Pavel</div>
                              <div className="text-gray-500 text-xs">2° connection</div>
                            </div>
                          </div>
                          <span className="text-green-400 text-xs font-bold">BUY</span>
                        </div>
                        <div className="text-white text-sm">
                          0.012 BTC • $1,200
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Cash • Prague
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-gray-900 rounded-xl p-4 border"
                        style={{ borderColor: vexlBrand.colors.primary.yellow }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                            <div>
                              <div className="text-white text-sm font-semibold">Your plumber Mike</div>
                              <div className="text-gray-500 text-xs">1° connection</div>
                            </div>
                          </div>
                          <span className="text-red-400 text-xs font-bold">SELL</span>
                        </div>
                        <div className="text-white text-sm">
                          0.025 BTC • $2,500
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Bank transfer • Flexible
                        </div>
                      </motion.div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-8 left-4 right-4 flex justify-around items-center">
                      <div className="w-6 h-6 rounded bg-gray-800"></div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}>
                        <span className="text-black text-xl font-bold">+</span>
                      </div>
                      <div className="w-6 h-6 rounded bg-gray-800"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Popup */}
            {showNotification && (
              <motion.div
                className="absolute top-20 left-4 right-4 bg-white rounded-2xl p-4 shadow-2xl z-40"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}>
                    <span className="text-black font-black text-lg">V</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Vexl</div>
                    <div className="text-sm text-gray-600">{notificationText}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
      </motion.div>

      {/* Title and Description */}
      {(title || description) && (
        <motion.div 
          className="mt-8 text-center"
          initial={animate ? { opacity: 0, y: 20 } : {}}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          {title && (
            <h3 className="text-2xl font-bold mb-2" style={{ color: vexlBrand.colors.primary.yellow }}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-400 max-w-md mx-auto">
              {description}
            </p>
          )}
        </motion.div>
      )}

      {/* Screenshot Indicators */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreenshot(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentScreenshot 
                  ? 'bg-yellow-400 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}