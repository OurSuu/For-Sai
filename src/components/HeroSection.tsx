import React, { useEffect } from 'react';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

// --- Sub Components ---

const ShootingStar = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ x: -100, y: -100, opacity: 1, scale: 0.5 }}
    animate={{ x: "150vw", y: "150vh", opacity: 0 }}
    transition={{
      duration: 3,
      ease: "easeInOut",
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 15 + 10,
    }}
    className="absolute top-0 left-0 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent rotate-45 z-0 pointer-events-none"
  />
);

const Counter = ({ from, to, delay }: { from: number; to: number; delay: number }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration: 4, ease: "easeOut", delay: delay });
    return controls.stop;
  }, [count, to, delay]);

  return <motion.span>{rounded}</motion.span>;
};

// --- Main Component ---

interface HeroSectionProps {
    onComplete: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onComplete }) => {

  const startDelay = 1;      
  const lineDuration = 3.5;  
  const fadeDuration = 2;    

  const messages = [
    "นี่คือเว็บที่ฉันตั้งใจทำขึ้น... เพื่อเป็นความทรงจำของเรา",
    "ฉันตั้งใจทำมันมากเลยนะ เพื่อมาให้เธอในวันนี้",
    { 
        type: "jsx", 
        content: <>ขอบคุณนะที่ใช้ชีวิตร่วมกันมาถึง <span className="text-[#D4AF37] text-xl md:text-4xl font-serif italic mx-1"><Counter from={0} to={425} delay={startDelay + (2 * lineDuration)} /> </span> วัน</> 
    },
    "เธอมอบหลายๆ สิ่งให้ฉันจริงๆ อะไรที่ไม่เคยทำ... เธอพาทำหมดเลย",
    "ฉันมีความสุขมากๆ เลยล่ะ!",
  ];

  const part1TotalTime = startDelay + (messages.length * lineDuration);

  const boxAppearTime = part1TotalTime + 2; 

  const wishes = [
    "ต่อจากนี้... เธอต้องมีความสุขมากๆ นะ",
    "ดูแลตัวเองดีๆ อย่าเจ็บไข้ได้ป่วยเลยนะคนเก่ง",
    "อาหารการกินเลือกกินดีๆ หน่อย อย่าติดขี้เกียจล่ะ",
    "พยายามมีความสุขให้มากๆๆๆๆๆๆๆ นะ",
    "ขอบคุณและขอโทษสำหรับทุกสิ่งนะ..."
  ];

  const totalAnimationTime = boxAppearTime + (wishes.length * lineDuration) + 2;

  useEffect(() => {
    const timer = setTimeout(() => { onComplete(); }, totalAnimationTime * 1000);
    return () => clearTimeout(timer);
  }, [onComplete, totalAnimationTime]);

  return (
    // Mobile: py-10, px-4 | Desktop: py-20
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-[#050A18] px-4 py-10 md:py-20">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a2342] via-[#050A18] to-black opacity-90"></div>
      
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 3 === 0 ? 'text-amber-200' : 'text-slate-500'}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 10 }}
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        >
           <Star size={Math.random() * 2 + 1} fill="currentColor" />
        </motion.div>
      ))}
      <ShootingStar delay={2} />
      <ShootingStar delay={15} />

      {/* Main Container: Mobile w-full, Desktop max-w-2xl */}
      <div className="z-10 w-full max-w-2xl relative mt-4 md:mt-10">
        
        <motion.div 
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, delay: 0.5 }}
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8 md:mb-12 opacity-50"
        ></motion.div>

        {/* Part 1 Messages */}
        <div className="space-y-6 md:space-y-8 text-center mb-10 md:mb-16">
            {messages.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }} 
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: startDelay + (index * lineDuration), duration: fadeDuration, ease: "easeOut" }}
                    // Mobile: text-base (16px) | Desktop: text-xl (20px)
                    className="text-slate-300 font-light text-base md:text-xl leading-relaxed tracking-wide px-2"
                >
                    {typeof item === 'string' ? item : item.content}
                </motion.div>
            ))}
        </div>

        {/* Heart Divider */}
        <motion.div 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: part1TotalTime, type: "spring", duration: 2 }}
            className="flex justify-center my-6 md:my-10"
        >
            <div className="relative p-2">
                <div className="absolute inset-0 bg-[#D4AF37] blur-[30px] opacity-10 animate-pulse"></div>
                <Heart className="text-[#D4AF37] fill-[#D4AF37]/10" size={32} />
            </div>
        </motion.div>

        {/* Part 2 Wishes Box */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: boxAppearTime, duration: 1.5, ease: "easeOut" }}
            // Mobile: p-6 | Desktop: p-8
            className="space-y-5 md:space-y-6 text-center bg-slate-900/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl md:rounded-3xl border border-[#D4AF37]/10 shadow-2xl relative overflow-hidden mx-2"
        >
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-12 pointer-events-none"></div>
            {wishes.map((text, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: boxAppearTime + 0.5 + (index * lineDuration), duration: fadeDuration }}
                    // Mobile: text-base | Desktop: text-xl
                    className={`leading-relaxed ${index === wishes.length - 1 ? "text-[#D4AF37] font-serif italic pt-4 text-lg md:text-2xl" : "text-slate-200 font-light text-base md:text-xl"}`}
                >
                    {text}
                </motion.div>
            ))}
        </motion.div>

        <motion.div 
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, delay: totalAnimationTime - 2 }}
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-12 opacity-50"
        ></motion.div>
        
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: totalAnimationTime, duration: 2 }}
            className="text-center mt-8 pb-10"
        >
            <p className="text-[#D4AF37]/50 text-[10px] tracking-[0.3em] uppercase animate-pulse">Memories Unlocked ↓</p>
        </motion.div>
      </div>
    </section>
  );

};

export default HeroSection;