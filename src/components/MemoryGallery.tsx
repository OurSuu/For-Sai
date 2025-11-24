import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Fingerprint } from 'lucide-react';
import { memories } from '../data/memories';

// Define Memory type with the correct shape.
type Memory = {
  id: number | string;
  imageUrl: string;
  title?: string;
  date?: string;
  [key: string]: any;
};

const MemoryGallery: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = memories.length;
  const [direction, setDirection] = useState(0);

  // Fix: Use window.setInterval/clearInterval, not NodeJS. This prevents TS errors in browser env.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use useCallback for stable functions referenced in useEffect
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Auto Slide ทุก 4 วินาที
    // Prevent multiple intervals by clearing before setting.
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Fix: Remove currentIndex from deps, or it will reset interval every slide!
    // This preserves proper auto-slide.
  }, [nextSlide]);

  const onDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 20) prevSlide();
    else if (info.offset.x < -20) nextSlide();
  };

  const getVisibleIndices = () => {
    const leftIndex = (currentIndex - 1 + total) % total;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % total;
    return [leftIndex, centerIndex, rightIndex];
  };

  const visibleIndices = getVisibleIndices();

  const variants = {
    center: { x: 0, scale: 1, zIndex: 10, rotateY: 0, opacity: 1, filter: "blur(0px)" },
    left: { x: "-60%", scale: 0.85, zIndex: 5, rotateY: 25, opacity: 0.7, filter: "blur(2px)" },
    right: { x: "60%", scale: 0.85, zIndex: 5, rotateY: -25, opacity: 0.7, filter: "blur(2px)" },
    enter: (direction: number) => ({
      x: direction > 0 ? "120%" : "-120%",
      scale: 0.7,
      zIndex: 0,
      opacity: 0
    }),
    exit: (direction: number) => ({
      x: direction > 0 ? "-120%" : "120%",
      scale: 0.7,
      zIndex: 0,
      opacity: 0
    })
  };

  // -- Smooth luxury transition --
  const smoothTransition = {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1] as const  // Fix: add as const to satisfy Transition typing
  };

  return (
    <section className="min-h-[90vh] bg-[#0B0F19] overflow-hidden flex flex-col justify-between items-center py-10 relative">
      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center w-full px-4 z-20 mb-10">
        <h2 className="text-3xl md:text-5xl text-[#D4AF37] font-serif italic drop-shadow-md mb-2">The Gallery</h2>
        <p className="text-slate-500 text-[10px] md:text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-2">
          {isMobile ? <><Fingerprint size={12} /> Swipe (Showing 3/{total})</> : `${total} Moments in Time`}
        </p>
      </div>

      {/* --- 3D View Container --- */}
      <div className="flex-1 w-full flex items-center justify-center relative [perspective:1000px] h-[350px] md:h-[450px]">

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={onDragEnd}
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        ></motion.div>

        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          {memories.map((memoryObj, index) => {
            // Type assertion ensures TypeScript understands the shape of each memory
            const memory = memoryObj as Memory;
            let position = '';
            if (index === currentIndex) position = 'center';
            else if (index === visibleIndices[0]) position = 'left';
            else if (index === visibleIndices[1]) position = 'center';
            else if (index === visibleIndices[2]) position = 'right';

            if (!visibleIndices.includes(index)) return null;

            const isCenter = position === 'center';

            return (
              <motion.div
                key={memory.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate={position}
                exit="exit"
                transition={smoothTransition}
                className="absolute w-[180px] h-[280px] md:w-[240px] md:h-[360px] top-1/2 left-1/2 -ml-[90px] -mt-[140px] md:-ml-[120px] md:-mt-[180px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Content */}
                <div className="w-full h-full p-2 bg-slate-900/80 border border-[#D4AF37]/30 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {/* Ken Burns Effect */}
                    <motion.img
                      src={memory.imageUrl}
                      alt={memory.title ?? ""}
                      className="w-full h-full object-cover"
                      animate={{ scale: isCenter ? 1.1 : 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                    <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                      <span className="text-[#D4AF37] text-[10px] font-mono tracking-widest mb-1">{memory.date ?? ""}</span>
                      <h3 className="text-white text-sm font-serif italic line-clamp-1">{memory.title ?? ""}</h3>
                    </div>
                  </div>
                </div>
                {/* Reflection */}
                <div
                  className="absolute top-full left-0 w-full h-full origin-top transform scale-y-[-1] opacity-15 pointer-events-none blur-[2px]"
                  style={{
                    background: `url(${memory.imageUrl}) center/cover no-repeat`,
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
                  }}
                ></div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="flex-none z-20 mb-6 w-full flex justify-center">
        {!isMobile ? (
          <div className="flex gap-8">
            <button onClick={prevSlide} className="p-4 rounded-full border border-slate-700 text-slate-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-slate-900/50 backdrop-blur">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="p-4 rounded-full border border-slate-700 text-slate-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-slate-900/50 backdrop-blur">
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {memories.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#D4AF37] w-4' : 'bg-slate-600'}`}></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MemoryGallery;