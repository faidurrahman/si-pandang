import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  activeTab: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, activeTab }) => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Tampilkan splash screen setiap kali activeTab berubah
    setShowSplash(true);
    
    // Sembunyikan splash screen setelah 800ms
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <>
      {/* Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center space-y-6 bg-[#0a1e3b]"
          >
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9" 
                alt="Logo Kecamatan Ujung Pandang" 
                className="w-24 md:w-28 h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="space-y-1">
                <h2 className="text-white text-xl md:text-3xl font-bold tracking-widest uppercase">
                  KECAMATAN UJUNG PANDANG
                </h2>
                <h3 className="text-white/90 text-lg md:text-xl font-medium tracking-widest uppercase">
                  KOTA MAKASSAR
                </h3>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content Transisi */}
      <AnimatePresence mode="wait">
        {!showSplash && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
