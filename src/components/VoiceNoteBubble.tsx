'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { VoiceNoteData } from '@/types/chat';

interface VoiceNoteBubbleProps {
  voiceNote: VoiceNoteData;
  isUser: boolean;
}

// Waveform bar heights mimicking WhatsApp audio note
const WAVEFORM_HEIGHTS = [
  25, 45, 75, 55, 30, 60, 95, 80, 40, 70, 85, 100, 65, 45, 90, 75, 50, 80, 60, 35, 70, 90, 55, 30,
];

export const VoiceNoteBubble: React.FC<VoiceNoteBubbleProps> = ({ voiceNote, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSec = voiceNote.audioDurationSec || 4;

  const playSimulatedAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Play a soft natural FM synthesized vocal formant melody
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = voiceNote.audioToneFrequency || 220;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.8);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 1.8);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + 3.2);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + totalSec - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + totalSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + totalSec);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // Ignore
        }
      }
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      playSimulatedAudio();

      const startTime = Date.now() - playbackSec * 1000;
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= totalSec) {
          setPlaybackSec(totalSec);
          setIsPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setPlaybackSec(0), 400);
        } else {
          setPlaybackSec(elapsed);
        }
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const progressPercent = Math.min(100, (playbackSec / totalSec) * 100);
  const formattedTime = `0:0${Math.floor(playbackSec)}`;

  return (
    <div className="py-1 min-w-[240px] sm:min-w-[280px]">
      <div className="flex items-center gap-2.5">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition active:scale-95 flex-shrink-0 ${
            isUser ? 'bg-[#00A884] hover:bg-[#008f6f]' : 'bg-[#00A884] hover:bg-[#008f6f]'
          }`}
          title={isPlaying ? 'Pause' : 'Play voice note'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
          <div className="flex items-center gap-[2.5px] h-7 w-full cursor-pointer">
            {WAVEFORM_HEIGHTS.map((height, idx) => {
              const barPercent = (idx / WAVEFORM_HEIGHTS.length) * 100;
              const hasPlayed = barPercent <= progressPercent;
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-75 flex-1 ${
                    hasPlayed
                      ? 'bg-[#00A884]'
                      : isUser
                      ? 'bg-[#A3D9A5]'
                      : 'bg-[#CBD5E1]'
                  }`}
                  style={{
                    height: `${isPlaying ? Math.max(15, (height * (0.6 + Math.random() * 0.4))) : height}%`,
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#667781] px-0.5">
            <span className="font-mono">
              {isPlaying ? formattedTime : voiceNote.duration || '0:04'}
            </span>
            <button
              type="button"
              onClick={() =>
                setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))
              }
              className="text-[10px] font-bold px-1.5 py-0.5 bg-black/5 hover:bg-black/10 rounded-full transition text-[#54656F]"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>

        {/* Avatar with Mic Badge */}
        <div className="relative w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-slate-700">
            {isUser ? 'किसान' : 'KQ'}
          </span>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-xs">
            <Mic className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>

      {/* Transcription chip */}
      {voiceNote.transcript && (
        <div className="mt-1.5 pt-1.5 border-t border-black/5 flex items-center gap-1.5 text-xs text-slate-700">
          <span className="text-[#00A884] text-[11px] font-bold uppercase tracking-wider">
            Audio Note:
          </span>
          <span className="italic truncate font-medium text-[12.5px] text-[#111B21]">
            &ldquo;{voiceNote.transcript}&rdquo;
          </span>
        </div>
      )}
    </div>
  );
};
