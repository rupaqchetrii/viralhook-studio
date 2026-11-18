import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Mic, Activity, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export function AudioWaveformVisualizer({ isRecording, audioUrl, spokenDuration = 3.2, wordsCount = 9 }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Generate deterministic wave pattern based on word count & duration
  const waveBars = 48;
  const amplitudes = useRef(
    Array.from({ length: waveBars }, (_, i) => {
      const x = i / waveBars;
      // Speech pattern envelope (envelope rising in first 30%, sustained, tapering at end)
      const envelope = Math.sin(x * Math.PI);
      const noise = 0.3 * Math.sin(i * 1.7) + 0.2 * Math.cos(i * 3.1);
      return Math.max(0.15, Math.min(0.95, (envelope * 0.7 + noise * 0.3 + 0.2)));
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

        // Color coding by timeline zone:
        // 0-30% (0-1.5s): Hook Catch (Violet)
        // 30-60% (1.5-3.0s): Sweet Spot (Emerald)
        // 60-90% (3.0-4.5s): Danger Zone (Amber)
        // >90% (>4.5s): Drop-off Cliff (Rose)
        let strokeColor = '#818CF8'; // violet
        if (barIndexRatio <= progressRatio) {
          strokeColor = '#38BDF8'; // cyan active scrubber
        } else if (barIndexRatio < 0.30) {
          strokeColor = '#818CF8'; // violet
        } else if (barIndexRatio < 0.60) {
          strokeColor = '#34D399'; // emerald
        } else if (barIndexRatio < 0.90) {
          strokeColor = '#FBBF24'; // amber
        } else {
          strokeColor = '#F87171'; // rose
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
    <div className="p-3.5 rounded-2xl bg-black/50 border border-violet-500/30 space-y-2.5 animate-fade-in-up">
      {/* Top Bar Metrics */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            0–5s Spoken Cadence Waveform
          </span>
          {isRecording && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Mic className="w-3 h-3 animate-ping" />
              Recording Active
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>{spokenDuration.toFixed(1)}s Spoken</span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-emerald-400">{(wordsCount / Math.max(1, spokenDuration)).toFixed(2)} wps</span>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative bg-[#080911] rounded-xl p-2 border border-white/[0.06] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={450}
          height={64}
          className="w-full h-16 block cursor-pointer"
          onClick={togglePlay}
        />

        {/* Play Overlay Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-violet-600/80 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/50 backdrop-blur-md transition-all active:scale-90"
          title={isPlaying ? 'Pause' : 'Play Audio Scrubber'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Retention Threshold Guide Markers */}
      <div className="grid grid-cols-4 text-[10px] font-mono pt-1 text-center border-t border-white/[0.04]">
        <div className="text-violet-400">0s: Hook Grab</div>
        <div className="text-emerald-400">1.5s–2.8s: Sweet Spot</div>
        <div className="text-amber-400">3.5s: Cliff Risk</div>
        <div className="text-rose-400">&gt;4.5s: Drop-off</div>
      </div>
    </div>
  );
}
