'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, CheckCircle } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    } else {
      console.log('PWA installation declined');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <>
      {children}
      
      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-gray-900 border rounded-xl shadow-2xl p-4" style={{ borderColor: vexlBrand.colors.primary.yellow }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: vexlBrand.colors.primary.yellow }}
                  >
                    <Download className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Install Vexl Portal</h3>
                    <p className="text-sm text-gray-400">Access offline & get notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2 font-bold rounded-lg transition"
                  style={{ 
                    backgroundColor: vexlBrand.colors.primary.yellow,
                    color: vexlBrand.colors.primary.black
                  }}
                >
                  Install App
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white"
                >
                  Not Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-green-900/90 backdrop-blur border border-green-500 rounded-xl shadow-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={24} />
                  <div>
                    <h3 className="font-bold text-white">Update Available</h3>
                    <p className="text-sm text-green-200">New features and improvements</p>
                  </div>
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Installed Success */}
      <AnimatePresence>
        {isInstalled && showInstallPrompt && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur"
          >
            <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-sm">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: vexlBrand.colors.primary.yellow }}
              >
                <CheckCircle className="text-black" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">App Installed!</h2>
              <p className="text-gray-400 mb-6">
                Vexl Portal has been added to your home screen
              </p>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-6 py-3 font-bold rounded-lg"
                style={{ 
                  backgroundColor: vexlBrand.colors.primary.yellow,
                  color: vexlBrand.colors.primary.black
                }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}