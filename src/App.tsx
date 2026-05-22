/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Clock, Volume2, VolumeX, SkipBack, SkipForward, ArrowRight, Flame, CircleOff, Users } from 'lucide-react';
import { M3S_TIMELINE, TimelineEvent } from './data/m3s';
import { cn } from './lib/utils';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // in seconds
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [lariatState, setLariatState] = useState<'fire' | 'no-fire' | null>(null);
  const [lariatSplit, setLariatSplit] = useState<'4' | '8' | null>(null);
  const [quakeState, setQuakeState] = useState<'fire' | 'no-fire' | null>(null);
  const [quakeSplit, setQuakeSplit] = useState<'4' | '8' | null>(null);
  const [chainSplit, setChainSplit] = useState<'4' | '8' | null>(null);
  
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const reqRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // For beep sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Standard warning beep
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const updateTimer = () => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const newElapsed = pausedTimeRef.current + (now - startTimeRef.current) / 1000;
      setElapsed(newElapsed);
      reqRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      reqRef.current = requestAnimationFrame(updateTimer);
    } else {
       if (reqRef.current) cancelAnimationFrame(reqRef.current);
       if (startTimeRef.current !== null) {
           pausedTimeRef.current += (performance.now() - startTimeRef.current) / 1000;
           startTimeRef.current = null;
       }
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying]);

  // Handle current event logic
  const upcomingEvents = useMemo(() => {
    return M3S_TIMELINE.filter(ev => ev.timeSec >= elapsed);
  }, [elapsed]);

  const nextEvent = upcomingEvents[0];

  // Auto-scroll logic
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 5000); // Wait 5s before auto-scrolling resumes
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: true });
      container.addEventListener('touchmove', handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
        container.removeEventListener('touchmove', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (nextEvent && isPlaying && !isUserScrollingRef.current) {
      const el = document.getElementById(`event-${nextEvent.id}`);
      if (el && containerRef.current) {
        // Find visible top/bottom and center the active element if needed
        const container = containerRef.current;
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Use custom scroll check to avoid harsh snapping
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [nextEvent?.id, isPlaying]);

  // Alert logic -> beep at 5s before and 0s before
  const nextEventRef = useRef<TimelineEvent | null>(null);
  const alerted5sRef = useRef(false);
  const alerted0sRef = useRef(false);

  useEffect(() => {
     if (nextEventRef.current?.id !== nextEvent?.id) {
         nextEventRef.current = nextEvent || null;
         alerted5sRef.current = false;
         alerted0sRef.current = false;
         setLariatState(null);
         setLariatSplit(null);
         setQuakeState(null);
         setQuakeSplit(null);
         setChainSplit(null);
     }

     if (nextEvent && isPlaying) {
         const timeToNext = nextEvent.timeSec - elapsed;
         if (!alerted5sRef.current && timeToNext <= 5.0 && timeToNext > 4.5) {
             playBeep();
             alerted5sRef.current = true;
         }
         if (!alerted0sRef.current && timeToNext <= 0.0) {
             playBeep(); // Double beep or something could be nice, for now just same beep
             alerted0sRef.current = true;
         }
     }
  }, [elapsed, isPlaying, nextEvent]);

  // Formatting time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    pausedTimeRef.current = 0;
    setElapsed(0);
    startTimeRef.current = null;
    alerted5sRef.current = false;
    alerted0sRef.current = false;
    setLariatState(null);
    setLariatSplit(null);
    setQuakeState(null);
    setQuakeSplit(null);
    setChainSplit(null);
    if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdjustTime = (delta: number) => {
    let newElapsed = elapsed + delta;
    if (newElapsed < 0) newElapsed = 0;
    
    setElapsed(newElapsed);
    
    if (isPlaying) {
      if (startTimeRef.current !== null) {
          startTimeRef.current -= delta * 1000;
      }
    } else {
        pausedTimeRef.current = newElapsed;
    }
  };

  const handleJumpToTime = (targetTimeSec: number) => {
    // 提早 3 秒跳轉，讓使用者能聽到 5 秒前的倒數提示
    let newElapsed = Math.max(0, targetTimeSec - 3);
    
    setElapsed(newElapsed);
    pausedTimeRef.current = newElapsed;
    
    if (isPlaying) {
      startTimeRef.current = performance.now();
    }

    alerted5sRef.current = false;
    alerted0sRef.current = false;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col selection:bg-amber-500/30 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-3 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center z-10 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-sans">M3S 時間軸提示</span>
        </h1>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title={soundEnabled ? "停用音效提示" : "啟用音效提示"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container - Compact Grid for one screen */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Side: Timer & Controls & Toggles */}
        <section className="w-full lg:w-[45%] flex flex-col gap-5 shrink-0">
          
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5 md:p-6 flex flex-col items-center">
            <h2 className="text-neutral-500 font-medium tracking-widest text-xs mb-2 uppercase font-sans">
              Elapsed Time
            </h2>
            <div className="text-6xl lg:text-7xl font-bold font-mono tracking-tighter text-white tabular-nums drop-shadow-sm mb-5">
              {formatTime(elapsed)}
            </div>

            <div className="flex gap-2 w-full justify-center mb-5">
               <button onClick={() => handleAdjustTime(-1)} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-all font-medium active:scale-95">
                 <SkipBack className="w-4 h-4" /> 1s
               </button>
               <button onClick={() => handleAdjustTime(-0.1)} className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-all font-medium active:scale-95">
                 -0.1s
               </button>
               <button onClick={() => handleAdjustTime(0.1)} className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-all font-medium active:scale-95">
                 +0.1s
               </button>
               <button onClick={() => handleAdjustTime(1)} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-all font-medium active:scale-95">
                 1s <SkipForward className="w-4 h-4" />
               </button>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handlePlayPause}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]",
                  isPlaying 
                   ? "bg-neutral-800 text-amber-500 hover:bg-neutral-700 font-sans" 
                   : "bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20 font-sans"
                )}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                {isPlaying ? '暫停計時' : '開始計時'}
              </button>
              <button 
                onClick={handleReset}
                className="px-5 py-4 rounded-2xl bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center justify-center active:scale-[0.98]"
                title="重設時間"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Side: Next Event target & Timeline */}
        <section className="w-full lg:w-[55%] flex flex-col gap-5">
          
          {/* Next Event Target */}
          <div className="w-full bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 border border-neutral-700/50 rounded-3xl p-6 relative overflow-hidden shadow-xl shrink-0">
            {/* Progress Bar top indicator */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-neutral-800">
               {nextEvent && (
                  <div 
                    className="h-full bg-amber-500 transition-all ease-linear" 
                    style={{ width: `${Math.max(0, Math.min(100, (1 - (nextEvent.timeSec - elapsed)/10) * 100))}%` }} 
                  />
               )}
            </div>
            
            <h3 className="text-neutral-400 font-medium mb-3 flex items-center gap-2 text-sm uppercase tracking-wider font-sans">
              <ArrowRight className="w-4 h-4 text-amber-500" />即將到來
            </h3>
            
            {nextEvent ? (
              <div className="flex flex-col gap-2">
                <div className="text-3xl lg:text-4xl font-bold text-white tracking-tight break-keep font-sans pb-2">
                  {nextEvent.name}
                </div>
                <div className="flex items-end justify-between mt-1 pt-3 border-t border-neutral-700/50">
                  <div className="tabular-nums font-mono text-neutral-400">
                    <span className="text-xs uppercase mr-2 tracking-wider">Time</span>
                    <span className="text-amber-500 font-bold px-2 py-1 bg-amber-500/10 rounded-lg">{nextEvent.timeStr}</span>
                  </div>
                  <div className={cn(
                    "text-4xl tabular-nums font-mono font-black",
                    (nextEvent.timeSec - elapsed) <= 5.0 ? "text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-neutral-300"
                  )}>
                    -{(nextEvent.timeSec - Math.floor(elapsed*10)/10).toFixed(1)}<span className="text-2xl text-neutral-500">s</span>
                  </div>
                </div>

                {/* Mechanic State Toggles */}
                {(nextEvent?.name.includes('金臂鈎') || nextEvent?.name.includes('強震衝') || nextEvent?.name.includes('大亂擊')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                    {/* Lariat (金臂鈎) */}
                    {nextEvent?.name.includes('金臂鈎') && (
                    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-bold text-sm tracking-widest leading-none">金臂鈎</span>
                        {(lariatState || lariatSplit) && (
                          <button onClick={() => { setLariatState(null); setLariatSplit(null); }} className="text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-2 py-1 rounded-md leading-none">
                            清除
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLariatState('fire')}
                            className={cn(
                              "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center transition-all",
                              lariatState === 'fire' 
                                ? "bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <span className={cn("text-xs flex items-center gap-1 mb-1", lariatState === 'fire' ? "text-red-300" : "text-neutral-400")}>
                              {lariatState === 'fire' && <Flame className="w-3 h-3" />} 有火
                            </span>
                            <span className={cn("font-black text-xl tracking-widest", lariatState === 'fire' ? "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" : "text-neutral-500")}>圈內</span>
                          </button>
                          <button
                            onClick={() => setLariatState('no-fire')}
                            className={cn(
                              "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center transition-all",
                              lariatState === 'no-fire' 
                                ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <span className={cn("text-xs flex items-center gap-1 mb-1", lariatState === 'no-fire' ? "text-blue-300" : "text-neutral-400")}>
                              {lariatState === 'no-fire' && <CircleOff className="w-3 h-3" />} 無火
                            </span>
                            <span className={cn("font-black text-xl tracking-widest", lariatState === 'no-fire' ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" : "text-neutral-500")}>圈外</span>
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLariatSplit('4')}
                            className={cn(
                              "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                              lariatSplit === '4' 
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <Users className="w-4 h-4" /> <span className="font-bold text-sm">四分</span>
                          </button>
                          <button
                            onClick={() => setLariatSplit('8')}
                            className={cn(
                              "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                              lariatSplit === '8' 
                                ? "bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <Users className="w-4 h-4" /> <span className="font-bold text-sm">八分</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {/* Quake (強震衝) */}
                    {nextEvent?.name.includes('強震衝') && (
                    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-bold text-sm tracking-widest leading-none">強震衝</span>
                        {(quakeState || quakeSplit) && (
                          <button onClick={() => { setQuakeState(null); setQuakeSplit(null); }} className="text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-2 py-1 rounded-md leading-none">
                            清除
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setQuakeState('fire')}
                            className={cn(
                              "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center transition-all",
                              quakeState === 'fire' 
                                ? "bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <span className={cn("text-xs flex items-center gap-1 mb-1", quakeState === 'fire' ? "text-red-300" : "text-neutral-400")}>
                              {quakeState === 'fire' && <Flame className="w-3 h-3" />} 有火
                            </span>
                            <span className={cn("font-black text-xl tracking-wider", quakeState === 'fire' ? "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" : "text-neutral-500")}>防擊退</span>
                          </button>
                          <button
                            onClick={() => setQuakeState('no-fire')}
                            className={cn(
                              "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center transition-all",
                              quakeState === 'no-fire' 
                                ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <span className={cn("text-xs flex items-center gap-1 mb-1", quakeState === 'no-fire' ? "text-blue-300" : "text-neutral-400")}>
                              {quakeState === 'no-fire' && <CircleOff className="w-3 h-3" />} 無火
                            </span>
                            <span className={cn("font-black text-xl tracking-wider", quakeState === 'no-fire' ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" : "text-neutral-500")}>距離衰減</span>
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setQuakeSplit('4')}
                            className={cn(
                              "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                              quakeSplit === '4' 
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <Users className="w-4 h-4" /> <span className="font-bold text-sm">四分</span>
                          </button>
                          <button
                            onClick={() => setQuakeSplit('8')}
                            className={cn(
                              "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                              quakeSplit === '8' 
                                ? "bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                                : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                            )}
                          >
                            <Users className="w-4 h-4" /> <span className="font-bold text-sm">八分</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Chain Deathmatch (大亂擊) */}
                    {nextEvent?.name.includes('大亂擊') && (
                    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-bold text-sm tracking-widest leading-none">野蠻大亂擊</span>
                        {chainSplit && (
                          <button onClick={() => setChainSplit(null)} className="text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-2 py-1 rounded-md leading-none">
                            清除
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChainSplit('4')}
                          className={cn(
                            "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                            chainSplit === '4' 
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                              : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                          )}
                        >
                          <Users className="w-4 h-4" /> <span className="font-bold text-sm">四分</span>
                        </button>
                        <button
                          onClick={() => setChainSplit('8')}
                          className={cn(
                            "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all",
                            chainSplit === '8' 
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                              : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                          )}
                        >
                          <Users className="w-4 h-4" /> <span className="font-bold text-sm">八分</span>
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-neutral-500 italic py-6 text-center font-sans tracking-wide">
                副本機制已全部結束
              </div>
            )}
          </div>

          {/* Timeline List (Compact Window - visible ~4 items) */}
          <div 
            ref={containerRef}
            className="w-full h-[280px] overflow-y-auto custom-scrollbar relative scroll-smooth bg-neutral-900/40 border border-neutral-800 rounded-3xl p-3 shrink-0"
          >
             <div className="flex flex-col gap-2 pb-16">
               {M3S_TIMELINE.map((ev) => {
                 const isPast = elapsed > ev.timeSec + 2; 
                 const isNext = nextEvent?.id === ev.id;
                 
                 return (
                   <div 
                     key={ev.id} 
                     id={`event-${ev.id}`}
                     onClick={() => handleJumpToTime(ev.timeSec)}
                     className={cn(
                       "flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 font-sans cursor-pointer group hover:scale-[1.02] active:scale-[0.98]",
                       isNext ? "bg-amber-500/15 border border-amber-500/30 shadow-md shadow-amber-900/20 backdrop-blur-sm" : "hover:bg-neutral-800/80 border border-transparent",
                       isPast ? "opacity-30 mix-blend-luminosity grayscale hover:opacity-80" : "opacity-100"
                     )}
                   >
                     <div className={cn(
                       "w-12 md:w-14 text-right tabular-nums font-mono font-medium text-sm",
                       isNext ? "text-amber-400" : "text-neutral-500 group-hover:text-neutral-400 transition-colors"
                     )}>
                       {ev.timeStr}
                     </div>
                     
                     <div className="relative flex items-center justify-center shrink-0 w-3 h-3">
                       {/* The dot on the timeline */}
                       <div className={cn(
                         "absolute w-2 h-2 rounded-full transition-all duration-500 outline outline-3 outline-neutral-900",
                         isPast ? "bg-neutral-600 outline-transparent" : isNext ? "bg-amber-500 scale-150 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]" : "bg-neutral-500"
                       )} />
                     </div>

                     <div className={cn(
                       "flex-1 font-bold text-sm md:text-base truncate transition-colors px-1",
                       isNext ? "text-amber-50" : isPast ? "text-neutral-600 group-hover:text-neutral-300" : "text-neutral-300"
                     )}>
                       {ev.name}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

        </section>

      </main>
    </div>
  );
}