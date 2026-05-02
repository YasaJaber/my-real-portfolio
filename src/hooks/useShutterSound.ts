"use client";

import { useCallback } from "react";

export interface UseShutterSoundReturn {
  play: () => Promise<void>;
  isLoaded: boolean;
}

const SHUTTER_SOUND_URL = "/sounds/camera-shutter.mp3";

/**
 * Plays a camera shutter sound from an MP3 file.
 * Creates a fresh Audio element on each play for maximum reliability.
 */
export function useShutterSound(enabled: boolean = true): UseShutterSoundReturn {
  const play = useCallback(async (): Promise<void> => {
    if (!enabled || typeof window === "undefined") return;

    try {
      const audio = new Audio(SHUTTER_SOUND_URL);
      audio.volume = 0.5;
      await audio.play();
    } catch {
      // Silently fail — animation continues without sound.
    }
  }, [enabled]);

  return { play, isLoaded: true };
}
