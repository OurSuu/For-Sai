import React, { useState, useEffect } from 'react';

import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Fingerprint } from 'lucide-react';
import { memories } from '../data/memories';

// Bugfix: add Memory type definition for correct property access
type Memory = {
  id: string | number;
  imageUrl: string;
  title: string;
  date: string;
};

const MemoryGallery: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const numberOfCards = memories.length;
  const anglePerCard = 360 / numberOfCards; 

  // Mobile Config: รัศมีแคบ (110), การ์ดเล็ก (120x180), มุมกล้องไกล (1500)
  const radius = isMobile ? 110 : 450; 
  const cardWidth = isMobile ? 120 : 220; 
  const cardHeight = isMobile ? 180 : 320;
  const perspectiveValue = isMobile ? "1500px" : "1000px";

  const [currAngle, setCurrAngle] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => { setCurrAngle((prev) => prev - 0.1); }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({ rotateY: currAngle, transition: { duration: 0.1, ease: "linear" } });
  }, [currAngle, controls]);

  const nextSlide = () => setCurrAngle(Math.round((currAngle - anglePerCard) / anglePerCard) * anglePerCard);
  const prevSlide = () => setCurrAngle(Math.round((currAngle + anglePerCard) / anglePerCard) * anglePerCard);

  // Bugfix: Import PanInfo type only for type safety; use type import to avoid linting error
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type PanInfo = import('framer-motion').PanInfo;
  const onDragEnd = (_event: any, info: PanInfo) => {
    if (info.offset.x > 10) prevSlide(); else if (info.offset.x < -10) nextSlide();
  };

  return (
    // justify-between: จัดระยะห่างให้สมดุล
    <section className="h-screen bg-[#0B0F19] overflow-hidden flex flex-col justify-between items-center py-6 md:py-10 relative">

      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center w-full px-4 z-20 mt-4 md:mt-8 flex-none">
        <h2 className="text-3xl md:text-5xl text-[#D4AF37] font-serif italic drop-shadow-md mb-2">The Gallery</h2>
        <p className="text-slate-500 text-[10px] md:text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-2">
            {isMobile && <Fingerprint size={12} />} {isMobile ? "Swipe" : `${memories.length} Moments`}
        </p>
      </div>

      {/* Carousel */}
      <div className="flex-1 w-full flex items-center justify-center touch-pan-y relative z-10" style={{ perspective: perspectiveValue }}>
        <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0} onDragEnd={onDragEnd} className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing w-full h-full" style={{ touchAction: "pan-y" }}></motion.div>

        <motion.div animate={controls} style={{ transformStyle: "preserve-3d" }} className="relative" initial={{ width: 0, height: 0 }}>
          {(memories as Memory[]).map((memory, index) => (
            <div key={memory.id} className="absolute top-1/2 left-1/2 backface-visible"
              style={{
                marginTop: -cardHeight / 2, marginLeft: -cardWidth / 2, width: cardWidth, height: cardHeight,
                transform: `rotateY(${index * anglePerCard}deg) translateZ(${radius}px)`, transformStyle: "preserve-3d",
              }}>
                <div className="w-full h-full p-1 md:p-2 bg-slate-900/80 border border-[#D4AF37]/20 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden">
                    <div className="relative w-full h-full rounded overflow-hidden">
                        <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2 md:p-3">
                            <span className="text-[#D4AF37] text-[8px] md:text-[9px] font-mono tracking-widest mb-0.5">{memory.date}</span>
                            <h3 className="text-white text-[10px] md:text-xs font-serif italic line-clamp-1">{memory.title}</h3>
                        </div>
                    </div>
                </div>
                {/* Reflection */}
                <div className="absolute top-full left-0 w-full h-full origin-top transform scale-y-[-1] opacity-15 pointer-events-none blur-[2px]"
                  style={{
                    background: `url(${memory.imageUrl}) center/cover no-repeat`,
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
                  }}>
                </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer / Controls */}
      <div className="flex-none z-20 mb-6 md:mb-12 w-full flex justify-center"> 
          {!isMobile ? (
            <div className="flex gap-8">
                <button onClick={prevSlide} className="p-4 rounded-full border border-slate-700 text-slate-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-slate-900/50 backdrop-blur"><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} className="p-4 rounded-full border border-slate-700 text-slate-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-slate-900/50 backdrop-blur"><ChevronRight size={24} /></button>
            </div>
          ) : (
            <p className="text-slate-600 text-[9px] tracking-widest uppercase opacity-50 animate-pulse">Swipe Left / Right</p>
          )}
      </div>
    </section>
  );
};

export default MemoryGallery;