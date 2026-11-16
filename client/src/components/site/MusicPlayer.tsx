import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { trpc } from "@/lib/trpc";

const VOLUME = 0.5;

export default function MusicPlayer() {
  const { data } = trpc.music.get.useQuery(undefined, { staleTime: 60_000 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const trackUrl = data?.enabled && data?.url ? data.url : null;

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !trackUrl) return false;
    try {
      audio.volume = VOLUME;
      await audio.play();
      setPlaying(true);
      setNeedsGesture(false);
      return true;
    } catch {
      setPlaying(false);
      setNeedsGesture(true);
      return false;
    }
  }, [trackUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!trackUrl) {
      audio.pause();
      audio.removeAttribute("src");
      setPlaying(false);
      return;
    }
    if (audio.getAttribute("src") !== trackUrl) {
      audio.src = trackUrl;
      audio.load();
    }
    audio.volume = VOLUME;
    if (!userPaused) void tryPlay();
  }, [trackUrl, tryPlay, userPaused]);

  useEffect(() => {
    if (!needsGesture || userPaused) return;
    const unlock = () => {
      void tryPlay();
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "touchstart", "keydown", "scroll"];
    events.forEach(event => window.addEventListener(event, unlock, { passive: true }));
    return () => {
      events.forEach(event => window.removeEventListener(event, unlock));
    };
  }, [needsGesture, userPaused, tryPlay]);

  useEffect(() => {
    const timer = window.setTimeout(() => setHintVisible(false), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!trackUrl) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setUserPaused(true);
      return;
    }
    setUserPaused(false);
    const started = await tryPlay();
    if (!started) setNeedsGesture(true);
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline />
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 sm:bottom-7 sm:left-7">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar música do site" : "Tocar música do site"}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white text-[#12000a] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.85)] transition-transform hover:-translate-y-0.5"
        >
          {playing ? <Pause size={18} /> : needsGesture ? <VolumeX size={18} /> : <Play size={18} />}
        </button>

        {playing ? (
          <div className="flex items-center gap-2 rounded-full border border-gold/35 bg-[#2a0317]/85 px-3.5 py-2 backdrop-blur">
            <span className="flex items-end gap-[3px]" aria-hidden="true">
              <span className="h-2 w-[3px] animate-[floatSlow_1.1s_ease-in-out_infinite] rounded-full bg-gold" />
              <span className="h-3.5 w-[3px] animate-[floatSlow_0.9s_ease-in-out_infinite] rounded-full bg-gold" />
              <span className="h-2.5 w-[3px] animate-[floatSlow_1.3s_ease-in-out_infinite] rounded-full bg-gold" />
            </span>
            <span className="max-w-[140px] truncate font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
              {data?.title ?? "Trilha do site"}
            </span>
          </div>
        ) : (
          hintVisible && (
            <div className="flex items-center gap-2 rounded-full border border-gold/35 bg-[#2a0317]/85 px-3.5 py-2 backdrop-blur">
              <Volume2 size={13} className="text-gold" />
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
                Ativar música
              </span>
            </div>
          )
        )}

        <span className="sr-only">
          <Music2 size={12} />
        </span>
      </div>
    </>
  );
}
