import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ 
  duration = 30, 
  isRunning = false, 
  onTimeUp, 
  onTick,
  soundEnabled = true,
  autoStart = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart && isRunning);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (onTick) onTick(newTime);
          
          if (newTime <= 0) {
            setIsActive(false);
            if (onTimeUp) onTimeUp();
            if (soundEnabled) playTimeUpSound();
            return 0;
          }
          
          // Play warning sound in last 5 seconds
          if (newTime <= 5 && newTime > 0 && soundEnabled) {
            playWarningSound();
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onTick, onTimeUp, soundEnabled]);

  const playTimeUpSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playWarningSound = () => {
    // Create a shorter, higher-pitched warning beep for last 5 seconds
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Higher pitch and shorter duration for warning
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2); // Much shorter beep
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isExpired = timeLeft <= 0;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Timer Display */}
      <div className="relative">
        {/* Progress Ring */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={isExpired ? "#ef4444" : isUrgent ? "#f59e0b" : "#3b82f6"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - getProgressPercentage() / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Time display */}
          <div className={`absolute inset-0 flex items-center justify-center ${isUrgent ? 'timer-urgent' : ''}`}>
            <div className={`text-center ${isExpired ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-blue-600'}`}>
              <div className="text-3xl font-bold font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs font-medium">
                {isExpired ? 'ZEIT UM!' : isActive ? 'LÄUFT' : 'PAUSIERT'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isExpired && (
          <div className="text-red-600 font-bold text-lg animate-pulse">
            ⏰ Zeit abgelaufen!
          </div>
        )}
        {isUrgent && !isExpired && (
          <div className="text-yellow-600 font-bold">
            ⚠️ Weniger als 10 Sekunden!
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex space-x-3">
        <button
          onClick={toggle}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isActive ? 'Pausieren' : 'Starten'}
        </button>
        
        <button
          onClick={reset}
          className="btn-secondary px-4 py-2"
        >
          Zurücksetzen
        </button>
      </div>

      {/* Settings */}
      <div className="text-center text-sm text-gray-600">
        <div>Timer: {duration} Sekunden</div>
        <label className="flex items-center justify-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => {
              // This would need to be passed up to parent component
              // For now, just show the setting
            }}
            className="rounded"
          />
          <span>Sound aktiviert</span>
        </label>
      </div>
    </div>
  );
};

export default Timer;
