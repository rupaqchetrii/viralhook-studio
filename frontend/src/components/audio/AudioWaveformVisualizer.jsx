import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Activity, Clock, Mic } from 'lucide-react';

export function AudioWaveformVisualizer({ isRecording, audioUrl, spokenDuration = 3.2, wordsCount = 9 }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef(null);

  // Generate deterministic wave pattern based on word count & duration
  const waveBars = 48;
  const amplitudes = useRef(
    Array.from({ length: waveBars }, (_, i) => {
      const x = i / waveBars;
      const envelope = Math.sin(x * Math.PI);
      const noise = 0.3 * Math.sin(i * 1.7) + 0.2 * Math.cos(i * 3.1);
      return Math.max(0.15, Math.min(0.95, envelope * 0.7 + noise * 0.3 + 0.2));
    })
  ).current;

  // Real-time canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / waveBars;
      const progressRatio = spokenDuration > 0 ? currentTime / spokenDuration : 0;

      for (let i = 0; i < waveBars; i++) {
        const x = i * barWidth;
        const barIndexRatio = i / waveBars;

        // Dynamic motion if recording or playing
        let dynamicAmp = amplitudes[i];
        if (isRecording) {
          dynamicAmp = Math.min(1.0, dynamicAmp * (0.8 + 0.4 * Math.sin(phase + i * 0.4)));
        } else if (isPlaying) {
          dynamicAmp = Math.min(1.0, dynamicAmp * (0.9 + 0.2 * Math.sin(phase * 2 + i * 0.3)));
        }

        const barHeight = dynamicAmp * (height - 12);
        const y = (height - barHeight) / 2;

        let strokeColor = '#818CF8';
        if (barIndexRatio <= progressRatio) {
          strokeColor = '#EA4C89'; // active pink scrubber
        } else if (barIndexRatio < 0.30) {
          strokeColor = '#818CF8'; // violet
        } else if (barIndexRatio < 0.60) {
          strokeColor = '#10B981'; // emerald
        } else if (barIndexRatio < 0.90) {
          strokeColor = '#F59E0B'; // amber
        } else {
          strokeColor = '#EF4444'; // rose
        }

        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, Math.max(2, barWidth - 3), barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPlaying, currentTime, spokenDuration]);

  // Handle Play/Pause audio playback simulation
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentTime(0);
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= spokenDuration) {
            clearInterval(interval);
            setIsPlaying(false);
            return spokenDuration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10 space-y-3 animate-fade-in-up">
      {/* Top Bar Metrics */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EA4C89] animate-pulse" />
          <span className="font-bold text-[#0D0C22] dark:text-white flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#EA4C89]" />
            0–5s Spoken Cadence Spectrogram
          </span>
          {isRecording && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
              <Mic className="w-3 h-3 animate-ping" />
              Recording Active
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-[#6E6D7A] dark:text-zinc-400 flex items-center gap-2 font-bold">
          <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>{spokenDuration.toFixed(1)}s Spoken</span>
          <span>&bull;</span>
          <span className="text-emerald-600 dark:text-emerald-400">{(wordsCount / Math.max(1, spokenDuration)).toFixed(2)} wps</span>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative bg-white dark:bg-[#0D0C22] rounded-xl p-2 border border-[#E7E7E9] dark:border-white/10 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={450}
          height={60}
          className="w-full h-15 block cursor-pointer"
          onClick={togglePlay}
        />

        {/* Play Overlay Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#0D0C22] shadow-md transition-all active:scale-90"
          title={isPlaying ? 'Pause' : 'Play Audio Scrubber'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Retention Threshold Guide Markers */}
      <div className="grid grid-cols-4 text-[10px] font-mono font-bold pt-1 text-center border-t border-[#E7E7E9] dark:border-white/10">
        <div className="text-purple-600 dark:text-purple-400">0s: Hook Grab</div>
        <div className="text-emerald-600 dark:text-emerald-400">1.5s–2.8s: Sweet Spot</div>
        <div className="text-amber-500">3.5s: Cliff Risk</div>
        <div className="text-rose-500">&gt;4.5s: Drop-off</div>
      </div>
    </div>
  );
}
