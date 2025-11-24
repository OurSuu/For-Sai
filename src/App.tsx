import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './components/HeroSection';
import MemoryGallery from './components/MemoryGallery';
import VideoTheater from './components/VideoTheater';
import MusicPlayer from './components/MusicPlayer'; // Import มา

function App() {
  // สร้าง State สำหรับตรวจสอบว่า Intro จบหรือยัง
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  return (
    <main className="w-full overflow-hidden bg-[#0B0F19] min-h-screen text-slate-200">
      
      {/* ใส่ตรงนี้เลย จะได้ลอยอยู่ตลอดทุกหน้า */}
      <MusicPlayer />

      {/* ส่งฟังก์ชันไปให้ HeroSection เรียกเมื่อข้อความเล่นจบ */}
      <HeroSection onComplete={() => setIsIntroFinished(true)} />
      
      {/* ใช้ AnimatePresence เพื่อทำ Effect การปรากฏตัว */}
      <AnimatePresence>
        {isIntroFinished && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // เริ่มต้นจางและอยู่ต่ำ
            animate={{ opacity: 1, y: 0 }}  // ค่อยๆ ชัดและลอยขึ้น
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 2, ease: "easeOut" }} // ใช้เวลา 2 วินาทีในการโหลด
          >
            {/* Spacer */}
            <div className="h-20 bg-gradient-to-b from-[#050A18] to-[#0B0F19]"></div>
            
            <MemoryGallery />
            
            <VideoTheater />
            
            <footer className="text-center py-10 text-slate-600 text-xs bg-black tracking-widest uppercase">
              Designed for the Missing Variable.
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default App;