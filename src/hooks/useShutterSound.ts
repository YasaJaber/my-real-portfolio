"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseShutterSoundReturn {
  play: () => Promise<void>;
  isLoaded: boolean;
}

/**
 * Synthesizes a realistic DSLR-style camera shutter sound entirely in the
 * browser via the Web Audio API. No external audio file is required.
 *
 * The sound is layered:
 *   1. A sharp, bandpassed noise burst — the mirror flipping up / shutter close.
 *   2. A short low-mid thud — the mechanical body resonance.
 *   3. A second, softer noise burst ~120ms later — the shutter reopening.
 */
export function useShutterSound(enabled: boolean = true): UseShutterSoundReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    setIsLoaded(true);

    return () => {
      if (ctx.state !== "closed") {
        ctx.close().catch(() => {
          // Silently fail on cleanup
        });
      }
      audioContextRef.current = null;
    };
  }, [enabled]);

  // Mechanical "click" generated from a short noise burst with a bandpass filter.
  const playClick = useCallback(
    (
      ctx: AudioContext,
      startTime: number,
      intensity: number,
      decay: number,
      centerFreq: number,
      q: number
    ) => {
      const sampleRate = ctx.sampleRate;
      const length = Math.max(8, Math.floor(sampleRate * decay));
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        const env = Math.exp(-i / (sampleRate * 0.012));
        data[i] = (Math.random() * 2 - 1) * env;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = centerFreq;
      bandpass.Q.value = q;

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 350;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(intensity, startTime + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

      source.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(gain);
      gain.connect(ctx.destination);

      source.start(startTime);
      source.stop(startTime + decay + 0.01);
    },
    []
  );

  // Low body-thump played alongside the first click for warmth.
  const playThump = useCallback(
    (ctx: AudioContext, startTime: number, intensity: number) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.07);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(intensity, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    },
    []
  );

  const play = useCallback(async (): Promise<void> => {
    const ctx = audioContextRef.current;
    if (!enabled || !ctx) return;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // First click: shutter closes — sharp, mid-high frequency snap.
      playClick(ctx, now, 0.55, 0.07, 2400, 1.6);
      // Body resonance under the first click.
      playThump(ctx, now, 0.18);
      // Second click: shutter reopens — softer, slightly higher frequency.
      playClick(ctx, now + 0.13, 0.32, 0.09, 3000, 1.3);
    } catch {
      // Silently fail — animation continues without sound.
    }
  }, [enabled, playClick, playThump]);

  return { play, isLoaded };
}
