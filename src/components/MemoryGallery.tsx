import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Fingerprint } from 'lucide-react';
import { memories } from '../data/memories';

// Define the correct type for Memory object according to the expected fields used below
type Memory = {
  id: number | string;
  imageUrl: string;
  title?: string;
  date?: string;
};

const MemoryGallery: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // ใช้ index เพื่อบอกว่ารูปไหนคือ "รูปตรงกลาง"
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = memories.length;

  // Keep nextSlide and prevSlide stable, not using dependencies in effect
  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Auto Slide สำหรับมือถือ (เปลี่ยนทุก 4 วินาที)
    let interval: any;
    if (window.innerWidth < 768) {
      interval = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (interval) clearInterval(interval);
    };
    // Only run this effect once, dependencies are the slide functions and none of the state
  }, [nextSlide]);

  const onDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 20) prevSlide();
    else if (info.offset.x < -20) nextSlide();
  };

  // --- Logic คำนวณว่าจะโชว์ 3 รูปไหนบ้าง ---
  const getVisibleIndices = () => {
    const leftIndex = (currentIndex - 1 + total) % total;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % total;
    return [leftIndex, centerIndex, rightIndex];
  };

  const visibleIndices = getVisibleIndices();

  // --- Animation Variants สำหรับตำแหน่งต่างๆ ---
  const variants = {
    center: { x: 0, scale: 1, zIndex: 10, rotateY: 0, opacity: 1 },
    left: { x: "-60%", scale: 0.8, zIndex: 5, rotateY: 25, opacity: 0.6 },
    right: { x: "60%", scale: 0.8, zIndex: 5, rotateY: -25, opacity: 0.6 },
    hiddenLeft: { x: "-100%", scale: 0.5, zIndex: 0, opacity: 0 },
    hiddenRight: { x: "100%", scale: 0.5, zIndex: 0, opacity: 0 },
  };

  return (
    <section className="min-h-[90vh] bg-[#0B0F19] overflow-hidden flex flex-col justify-between items-center py-10 relative">

      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center w-full px-4 z-20 mb-10">
        <h2 className="text-3xl md:text-5xl text-[#D4AF37] font-serif italic drop-shadow-md mb-2">The Gallery</h2>
        <p className="text-slate-500 text-[10px] md:text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-2">
            {isMobile ? <><Fingerprint size={12} /> Swipe (Showing 3/12)</> : "12 Moments in Time"}
        </p>
      </div>

      {/* --- 3D View Container --- */}
      <div className="flex-1 w-full flex items-center justify-center relative [perspective:1000px] h-[350px] md:h-[450px]">
        {/* Swipe Area */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={onDragEnd}
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        ></motion.div>

        {/* แสดงผลการ์ด */}
        <AnimatePresence initial={false} mode="popLayout">
          {(memories as Memory[]).map((memory, index) => {
            // เช็คว่ารูปนี้ควรอยู่ตำแหน่งไหน
            let position: keyof typeof variants = 'hiddenLeft';
            if (index === currentIndex) position = 'center';
            else if (index === visibleIndices[0]) position = 'left';
            else if (index === visibleIndices[2]) position = 'right';
            // ซ่อนรูปที่ไม่อยู่ใน 3 อันดับแรก
            if (!visibleIndices.includes(index)) return null;

            return (
              <motion.div
                key={memory.id}
                variants={variants}
                initial={position === 'center' ? 'hiddenRight' : 'hiddenLeft'}
                animate={position}
                exit={position === 'left' ? 'hiddenLeft' : 'hiddenRight'}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="absolute w-[180px] h-[280px] md:w-[240px] md:h-[360px] top-1/2 left-1/2 -ml-[90px] -mt-[140px] md:-ml-[120px] md:-mt-[180px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Content */}
                <div className="w-full h-full p-2 bg-slate-900/80 border border-[#D4AF37]/30 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <img src={memory.imageUrl} alt={memory.title ?? 'memory'} className="w-full h-full object-cover" />
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
          // จุดบอกตำแหน่ง (Dots Indicator) สำหรับมือถือ
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