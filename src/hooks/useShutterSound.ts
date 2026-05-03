"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseShutterSoundReturn {
  play: () => Promise<void>;
  isLoaded: boolean;
}

const SHUTTER_SOUND_URL = "/sounds/camera-shutter.mp3";

/**
 * Plays a camera shutter sound from an MP3 file.
 * Pre-loads the audio on mount to ensure it's ready for playback.
 */
export function useShutterSound(enabled: boolean = true): UseShutterSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadedRef = useRef(false);

  // Pre-load audio on mount
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const audio = new Audio(SHUTTER_SOUND_URL);
    audio.volume = 0.5;
    audio.preload = "auto";
    
    // Load the audio file
    audio.load();
    
    // Mark as loaded when ready
    const handleCanPlay = () => {
      isLoadedRef.current = true;
    };
    
    audio.addEventListener("canplaythrough", handleCanPlay);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audioRef.current = null;
    };
  }, [enabled]);

  const play = useCallback(async (): Promise<void> => {
    if (!enabled || typeof window === "undefined") return;

    try {
      if (audioRef.current) {
        // Reset to start if already playing
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } else {
        // Fallback: create new audio if ref not available
        const audio = new Audio(SHUTTER_SOUND_URL);
        audio.volume = 0.5;
        await audio.play();
      }
    } catch {
      // Silently fail — animation continues without sound.
    }
  }, [enabled]);

  return { play, isLoaded: isLoadedRef.current };
}
