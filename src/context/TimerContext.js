// TimerContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  let intervalId = null;

  useEffect(() => {
    if (isRunning) {
      intervalId = BackgroundTimer.setInterval(() => {
        setTime(prev => {
          let { hours, minutes, seconds } = prev;
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
          }
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    }

    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    BackgroundTimer.clearInterval(intervalId);
  };

  const resetTimer = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Hook to use the timer anywhere
export const useTimer = () => useContext(TimerContext);
