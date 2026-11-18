import React, { memo, useState, useRef } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PacingBarometer } from './PacingBarometer';
import { LinterHighlighter } from './LinterHighlighter';
import { countWords, countCharacters } from '../../utils/pacingCalculator';
import { lintHook } from '../../utils/linterRules';
import { transcribeAudioAPI } from '../../services/api';
import { AudioWaveformVisualizer } from '../audio/AudioWaveformVisualizer';
import { Mic, MicOff, Upload, Loader2, Activity } from 'lucide-react';

// Memoized editor component: Typing in Hook A does not re-render Hook B
export const HookEditor = memo(function HookEditor({
  label, // 'Hook Option A' | 'Hook Option B'
  tagline,
  value,
  onChange,
  onApplyFix,
  badgeVariant = 'primary',
  wpm,
}) {
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const linterFlags = lintHook(value);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // 1. Browser Native Speech Recognition (Live Speech-to-Text)
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
    <Card className={`flex flex-col h-full rounded-3xl border-[#E7E7E9] dark:border-white/10 shadow-[0_8px_30px_rgba(13,12,34,0.05)] hover:shadow-[0_18px_45px_rgba(13,12,34,0.1)] tactile-hover relative overflow-hidden transition-all duration-300 ${
      badgeVariant === 'accent' ? 'hover:border-[#EA4C89]/60' : 'hover:border-[#0D0C22]/60'
    }`}>
      {/* Top Gradient Accent Bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${
        badgeVariant === 'accent'
          ? 'from-[#EA4C89] via-pink-400 to-purple-600'
          : 'from-[#0D0C22] via-indigo-900 to-indigo-600'
      }`} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <CardHeader className="bg-[#F8F7F4]/60 border-b border-[#E7E7E9]">
        <div className="flex items-center gap-2.5">
          <Badge variant={badgeVariant} size="sm" className="font-bold">
            {label}
          </Badge>
          <span className="text-xs text-[#6E6D7A] font-medium hidden sm:inline">{tagline}</span>
        </div>

        {/* Audio controls & stats */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Audio recording button */}
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? 'Stop Recording' : 'Speak Hook (Live Speech-to-Text)'}
            className={`px-2 py-1 rounded-full border text-[11px] font-sans flex items-center gap-1 transition-all ${
              isRecording
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-white text-[#6E6D7A] border-[#E7E7E9] hover:border-[#0D0C22] hover:text-[#0D0C22]'
            }`}
          >
            {isRecording ? <MicOff className="w-3 h-3 text-rose-600" /> : <Mic className="w-3 h-3 text-[#EA4C89]" />}
            <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Speak'}</span>
          </button>

          {/* Audio Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload audio/video clip to transcribe hook"
            className="px-2 py-1 rounded-full bg-white text-[#6E6D7A] border border-[#E7E7E9] hover:border-[#0D0C22] hover:text-[#0D0C22] text-[11px] font-sans flex items-center gap-1 transition-all"
          >
            {isUploading ? (
              <Loader2 className="w-3 h-3 animate-spin text-[#EA4C89]" />
            ) : (
              <Upload className="w-3 h-3 text-[#EA4C89]" />
            )}
            <span className="hidden sm:inline">{isUploading ? 'Whisper...' : 'Audio'}</span>
          </button>

          {/* Waveform visualizer toggle */}
          <button
            type="button"
            onClick={() => setShowWaveform(!showWaveform)}
            title="Toggle 0-5s Audio Waveform Spectrogram"
            className={`px-2 py-1 rounded-full border text-[11px] transition-all flex items-center gap-1 ${
              showWaveform || isRecording
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-[#6E6D7A] border-[#E7E7E9] hover:border-[#0D0C22] hover:text-[#0D0C22]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#EA4C89]" />
            <span className="hidden sm:inline">Spectrogram</span>
          </button>

          <span className="text-[#6E6D7A]">
            <strong className="text-[#0D0C22]">{wordCount}</strong> w
          </span>
          <span className="text-[#E7E7E9]">|</span>
          <span className={charCount > 280 ? 'text-rose-600 font-bold' : 'text-[#6E6D7A]'}>
            <strong className={charCount > 280 ? 'text-rose-600' : 'text-[#0D0C22]'}>
              {charCount}
            </strong>
            /280 chars
          </span>
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-4 p-6">
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            maxLength={350}
            placeholder={`Enter ${label} (or click 'Speak' to transcribe with Whisper)...`}
            className="w-full bg-[#F8F7F4] hover:bg-white text-[#0D0C22] placeholder-[#9E9EA7] text-sm sm:text-base rounded-xl p-4 border border-[#E7E7E9] focus:bg-white focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none resize-none transition-all duration-150 leading-relaxed font-sans shadow-sm"
          />
        </div>

        {/* 0-5s Spoken Audio Waveform Spectrogram Visualizer */}
        {(showWaveform || isRecording) && (
          <AudioWaveformVisualizer
            isRecording={isRecording}
            wordsCount={wordCount}
            spokenDuration={Math.max(1.2, wordCount / 2.75)}
          />
        )}

        {/* 1. Spoken Pacing Barometer (Dual Mode: Target Range Indicator) */}
        <PacingBarometer wordCount={wordCount} />

        {/* 2. Interactive Linguistic Linter Highlighter (Day 2 Pre-flight Linter) */}
        <LinterHighlighter flags={linterFlags} onApplyFix={onApplyFix} />
      </CardBody>
    </Card>
  );
});
