import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Make sure setIsPlaying updates state on play/pause events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // On mount, immediately try to play music (let browser policy control actual playback)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {
        // Autoplay might fail due to browser policy, but it's intended, user will tap to play manually
      });
    }
  }, []);

  // Button toggles play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/image/Loop2.mp3" type="audio/mpeg" />
      </audio>

      {/* Button */}
      <button
        onClick={togglePlay}
        type="button"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#D4AF37]/30 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 ${
            isPlaying ? "bg-[#D4AF37]/20 rotate-0" : "bg-slate-900/80"
        }`}
      >
        {/* Ring Animation */}
        {isPlaying && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-20 animate-ping"></span>
        )}
        {/* Icon */}
        <div className={`text-[#D4AF37] transition-all duration-300 ${isPlaying ? 'scale-110' : 'scale-100 opacity-60'}`}>
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </div>
      </button>

      {/* Label (Mobile: Hidden, Desktop: Show on Hover) */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-[#D4AF37] text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
        {isPlaying ? "Now Playing..." : "Click for Music"}
      </div>
    </div>
  );
};

export default MusicPlayer;