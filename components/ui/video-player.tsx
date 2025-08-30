'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    SkipBack,
    RotateCcw,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    width?: string | number;
    height?: string | number;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    onVolumeChange?: (volume: number) => void;
    onFullscreenChange?: (isFullscreen: boolean) => void;
}

export default function VideoPlayer({
    src,
    poster,
    className,
    autoPlay = false,
    loop = false,
    muted = false,
    controls = true,
    width = '100%',
    height = 'auto',
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onFullscreenChange,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [volume, setVolume] = useState(muted ? 0 : 1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('auto');
    const [buffered, setBuffered] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

    // Control visibility timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && showControls) {
            timer = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, showControls]);

    // Handle video events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setShowPoster(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime);
        };

        const handlePlay = () => {
            setIsPlaying(true);
            setShowPoster(false);
            onPlay?.();
        };

        const handlePause = () => {
            setIsPlaying(false);
            onPause?.();
        };

        const handleEnded = () => {
            setIsPlaying(false);
            onEnded?.();
        };

        const handleVolumeChange = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
            onVolumeChange?.(video.volume);
        };

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                setBuffered(bufferedEnd);
            }
        };

        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('volumechange', handleVolumeChange);
        video.addEventListener('progress', handleProgress);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('canplay', handleCanPlay);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('volumechange', handleVolumeChange);
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, [onPlay, onPause, onEnded, onTimeUpdate, onVolumeChange]);

    // Fullscreen handling
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFullscreenNow = !!document.fullscreenElement;
            setIsFullscreen(isFullscreenNow);
            onFullscreenChange?.(isFullscreenNow);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [onFullscreenChange]);

    // Play/Pause toggle
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    }, [isPlaying]);

    // Mute/Unmute toggle
    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    // Volume change
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    }, []);

    // Seek to time
    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && progressRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const seekTime = percentage * duration;
            videoRef.current.currentTime = seekTime;
        }
    }, [duration]);

    // Skip forward/backward
    const skipTime = useCallback((seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;

        try {
            if (!isFullscreen) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    }, [isFullscreen]);

    // Format time
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle mouse movement for controls visibility
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
    }, []);

    // Handle mouse leave
    const handleMouseLeave = useCallback(() => {
        if (isPlaying) {
            setShowControls(false);
        }
    }, [isPlaying]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current?.contains(document.activeElement)) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    skipTime(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    skipTime(10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (volume < 1) {
                        const newVolume = Math.min(1, volume + 0.1);
                        if (videoRef.current) {
                            videoRef.current.volume = newVolume;
                            setVolume(newVolume);
                        }
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (volume > 0) {
                        const newVolume = Math.max(0, volume - 0.1);
                        if (videoRef.current) {
                            videoRef.current.volume = newVolume;
                            setVolume(newVolume);
                        }
                    }
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, skipTime, volume, toggleFullscreen, toggleMute]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative group bg-black rounded-lg overflow-hidden',
                className
            )}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                className="w-full h-full object-contain"
                playsInline
            />

            {/* Poster Overlay */}
            {showPoster && poster && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${poster})` }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            )}

            {/* Loading Indicator */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                    >
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Center Play Button */}
            {!isPlaying && !showPoster && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={togglePlay}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 group"
                >
                    <Play size={32} className="text-black ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                </motion.button>
            )}

            {/* Video Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
                    >
                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div
                                ref={progressRef}
                                className="relative h-1 bg-white/30 rounded-full cursor-pointer group/progress"
                                onClick={handleSeek}
                            >
                                {/* Buffered Progress */}
                                <div
                                    className={`absolute top-0 left-0 h-full bg-white/50 rounded-full transition-all duration-300`}
                                    style={{ width: `${(buffered / duration) * 100}%` }}
                                />

                                {/* Played Progress */}
                                <div
                                    className={`absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300`}
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />

                                {/* Progress Handle */}
                                <div
                                    className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-300`}
                                    style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {/* Play/Pause */}
                                <button
                                    onClick={togglePlay}
                                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                    title="Play/Pause"
                                    aria-label="Play/Pause"
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>

                                {/* Skip Backward */}
                                <button
                                    onClick={() => skipTime(-10)}
                                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                    title="Skip backward 10 seconds"
                                    aria-label="Skip backward 10 seconds"
                                >
                                    <SkipBack size={20} />
                                </button>

                                {/* Skip Forward */}
                                <button
                                    onClick={() => skipTime(10)}
                                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                    title="Skip forward 10 seconds"
                                    aria-label="Skip forward 10 seconds"
                                >
                                    <SkipBack size={20} className="rotate-180" />
                                </button>

                                {/* Volume Control */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setShowVolumeSlider(true)}
                                    onMouseLeave={() => setShowVolumeSlider(false)}
                                >
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                        title="Mute/Unmute"
                                        aria-label="Mute/Unmute"
                                    >
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>

                                    {/* Volume Slider */}
                                    <AnimatePresence>
                                        {showVolumeSlider && (
                                            <motion.div
                                                ref={volumeSliderRef}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-2 bg-black/90 rounded-lg"
                                            >
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={volume}
                                                    onChange={handleVolumeChange}
                                                    title="Volume control"
                                                    aria-label="Volume control"
                                                    className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Time Display */}
                                <div className="text-white text-sm font-mono">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Settings */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                        title="Video settings"
                                        aria-label="Video settings"
                                    >
                                        <Settings size={20} />
                                    </button>

                                    {/* Settings Menu */}
                                    <AnimatePresence>
                                        {showSettings && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 rounded-lg min-w-[200px]"
                                            >
                                                {/* Playback Speed */}
                                                <div className="mb-3">
                                                    <label className="text-white text-sm block mb-2">Playback Speed</label>
                                                    <select
                                                        value={playbackRate}
                                                        onChange={(e) => {
                                                            const rate = parseFloat(e.target.value);
                                                            setPlaybackRate(rate);
                                                            if (videoRef.current) {
                                                                videoRef.current.playbackRate = rate;
                                                            }
                                                        }}
                                                        title="Playback speed"
                                                        aria-label="Playback speed"
                                                        className="w-full p-2 bg-white/10 text-white rounded border border-white/20 text-sm"
                                                    >
                                                        <option value={0.5}>0.5x</option>
                                                        <option value={0.75}>0.75x</option>
                                                        <option value={1}>1x</option>
                                                        <option value={1.25}>1.25x</option>
                                                        <option value={1.5}>1.5x</option>
                                                        <option value={2}>2x</option>
                                                    </select>
                                                </div>

                                                {/* Quality */}
                                                <div className="mb-3">
                                                    <label className="text-white text-sm block mb-2">Quality</label>
                                                    <select
                                                        value={quality}
                                                        onChange={(e) => setQuality(e.target.value)}
                                                        title="Video quality"
                                                        aria-label="Video quality"
                                                        className="w-full p-2 bg-white/10 text-white rounded border border-white/20 text-sm"
                                                    >
                                                        <option value="auto">Auto</option>
                                                        <option value="1080p">1080p</option>
                                                        <option value="720p">720p</option>
                                                        <option value="480p">480p</option>
                                                        <option value="360p">360p</option>
                                                    </select>
                                                </div>

                                                {/* Reset */}
                                                <button
                                                    onClick={() => {
                                                        if (videoRef.current) {
                                                            videoRef.current.currentTime = 0;
                                                            videoRef.current.playbackRate = 1;
                                                        }
                                                        setPlaybackRate(1);
                                                        setQuality('auto');
                                                        setShowSettings(false);
                                                    }}
                                                    title="Reset video settings"
                                                    aria-label="Reset video settings"
                                                    className="w-full p-2 bg-white/10 text-white rounded border border-white/20 text-sm hover:bg-white/20 transition-colors duration-200"
                                                >
                                                    <RotateCcw size={16} className="inline mr-2" />
                                                    Reset
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                    title="Toggle fullscreen"
                                    aria-label="Toggle fullscreen"
                                >
                                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Help */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 right-4 text-white/60 text-xs bg-black/50 px-2 py-1 rounded"
                    >
                        <div>Space: Play/Pause</div>
                        <div>←→: Skip 10s</div>
                        <div>↑↓: Volume</div>
                        <div>F: Fullscreen</div>
                        <div>M: Mute</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
