import React from 'react';
import { motion } from 'framer-motion';

const VideoTheater: React.FC = () => {
  const videos = [
    { id: 1, src: "/videos/v1.mp4", title: "Chapter I: ยัยเด็กน้อย" },
    { id: 2, src: "/videos/v2.mp4", title: "Chapter II: Ur Smile :>" },
  ];

  // Helper to detect mobile on FCLS
  // Use window.innerWidth under effects, fallback to straight orientation if window is undefined (SSR-safe)
  const getRotateY = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 0;
    }
    return index === 0 ? 25 : -25;
  };

  return (
    // Mobile: py-10 | Desktop: py-20
    <section className="min-h-screen bg-[#0B0F19] relative py-10 md:py-20 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header: ลด margin ในมือถือ */}
      <div className="text-center mb-10 md:mb-20 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl text-[#D4AF37] font-serif italic mb-2 tracking-wide">Moving Chronicles</h2>
        <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.4em]">Evidence of Love</p>
      </div>

      {/* Container: Mobile flex-col, Desktop flex-row */}
      <div className="w-full max-w-7xl px-4 flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center [perspective:1500px]">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              // Mobile: เอียงนิดเดียว (5deg) หรือไม่เอียงเลย | Desktop: เอียงสวยๆ (25deg)
              rotateY: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : (index === 0 ? 25 : -25),
              scale: 1
            }}
            whileHover={{ rotateY: 0, scale: 1.05, zIndex: 50, boxShadow: "0px 20px 50px rgba(0,0,0,0.5)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            // Mobile: w-full (เต็มจอ) | Desktop: w-[600px]
            className="relative w-full md:w-[600px] aspect-video bg-slate-900 rounded-xl p-2 md:p-3 border border-slate-800 shadow-2xl cursor-pointer group"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Effect ต่างๆ */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none z-20 rounded-xl"></div>
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-sm"></div>

            <div className="w-full h-full rounded-lg bg-black overflow-hidden relative z-10 shadow-inner">
              <video
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                controls
                playsInline
              >
                <source src={video.src} type="video/mp4" />
              </video>
            </div>

            <div className="absolute -bottom-8 md:-bottom-12 w-full text-center transform transition-transform duration-500" style={{ transform: "translateZ(30px)" }}>
              <p className="text-[#D4AF37] font-serif italic text-sm md:text-lg opacity-80 md:opacity-60 group-hover:opacity-100 transition-opacity">
                {video.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 md:mt-32 text-center px-4"
      >
        <p className="text-slate-400 font-light italic text-base md:text-xl">
          "Until the end of time..."
        </p>
        <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto mt-6 md:mt-8"></div>
      </motion.div>
    </section>
  );
};

export default VideoTheater;