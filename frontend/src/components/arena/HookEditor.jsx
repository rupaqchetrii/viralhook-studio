import React, { memo, useState, useRef } from 'react';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';
import { transcribeAudioAPI } from '../../services/api';
import { Mic, MicOff, Upload, Loader2, Sparkles } from 'lucide-react';

export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
  tagline,
  value,
  onChange,
  onApplyFix,
  badgeVariant = 'accent',
  accentColor = '#A78BFA',
}) {
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const linterFlags = lintHook(value);
  const isHookA = label.includes('A');

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // 1. Browser Native Speech Recognition (Whisper Speech-to-Text Fallback)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition isn't supported in this browser. Please use Google Chrome or upload an audio file.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onChange(transcript.trim());
      }
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 2. Audio File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await transcribeAudioAPI(file);
      if (data && data.transcript) {
        onChange(data.transcript);
      }
    } catch (err) {
      alert(err.message || 'Failed to transcribe audio.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 sm:p-6 flex flex-col h-full border transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-violet-950/20 ${
        isHookA
          ? 'focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20'
          : 'focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20'
      }`}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-wide ${
              isHookA
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {label}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">{tagline}</span>
        </div>

        {/* Action Controls & Word count badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Audio recording button */}
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? 'Stop Recording' : 'Speak Hook (Live Speech-to-Text)'}
            className={`px-2 py-1 rounded-md border text-[11px] font-sans flex items-center gap-1 transition-all ${
              isRecording
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-white/[0.04] text-zinc-300 border-white/[0.08] hover:border-violet-500/40 hover:text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-violet-400" />}
            <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Speak'}</span>
          </button>

          {/* Audio Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload audio/video clip to transcribe 0-5s spoken hook"
            className="px-2 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:border-violet-500/40 hover:text-white text-[11px] font-sans flex items-center gap-1 transition-all"
          >
            {isUploading ? (
              <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
            ) : (
              <Upload className="w-3 h-3 text-violet-400" />
            )}
            <span className="hidden sm:inline">{isUploading ? 'Whisper...' : 'Audio'}</span>
          </button>

          <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
            <strong className="text-white font-bold">{wordCount}</strong> w
          </span>
          <span
            className={`px-2 py-0.5 rounded-md border text-[11px] ${
              charCount > 280
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold'
                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
            }`}
          >
            {charCount}/280
          </span>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Sleek Text Area */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={350}
            placeholder={`Enter ${label} or click 'Speak' to transcribe with Whisper...`}
            className="w-full bg-black/30 text-white placeholder-zinc-500 text-sm sm:text-base rounded-xl p-4 border border-white/[0.08] focus:border-white/30 focus:outline-none resize-none transition-all duration-200 leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* 3s Spoken Delivery Pace Barometer */}
        <PacingBarometer wordCount={wordCount} />

        {/* Real-time Phrase Linter Diagnostics */}
        <div className="pt-2 border-t border-white/[0.06]">
          <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
        </div>
      </div>
    </div>
  );
});
