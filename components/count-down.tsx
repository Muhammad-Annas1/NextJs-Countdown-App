"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(""); // Initial state for duration
  const [timeLeft, setTimeLeft] = useState<number>(0); // Countdown timer state
  const [isActive, setIsActive] = useState<boolean>(false); // Whether the countdown is active
  const [isPaused, setIsPaused] = useState<boolean>(false); // Whether the countdown is paused
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval timer

  // Set the duration
  const handleSetDuration = (): void => {
    const durationNumber = Number(duration); // Safely convert duration to a number
    if (!isNaN(durationNumber) && durationNumber > 0) { // Ensure duration is a valid number
      setTimeLeft(durationNumber);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear any existing timers
      }
    } else {
      alert("Please enter a valid duration.");
    }
  };

  // Start the countdown
  const handleStart = (): void => {
    if (timeLeft > 0 && !isActive) {
      setIsActive(true); // Activate the timer
      setIsPaused(false); // Unpause the timer
    }
  };

  // Pause the countdown
  const handlePaused = (): void => {
    if (isActive) {
      setIsPaused(true); // Pause the timer
      setIsActive(false); // Set the active state to false
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear the interval when paused
      }
    }
  };

  // Reset the countdown
  const handleReset = (): void => {
    setIsActive(false); // Deactivate the timer
    setIsPaused(false); // Unpause the timer
    setTimeLeft(typeof duration === "number" ? Number(duration) : 0); // Reset the time left
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear the timer
    }
  };

  // Handle countdown effect
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!); // Stop timer when time reaches 0
            return 0;
          }
          return prevTime - 1; // Decrease time
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clean up the timer on unmount
      }
    };
  }, [isActive, isPaused]);

  // Format time into MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle input change for duration
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || ""); // Set duration safely
  };

  // JSX return statement rendering the Countdown UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-yellow-100 dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Countdown Timer
        </h1>
        <div className="flex items-center mb-6">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            Set
          </Button>
        </div>
        <div className="text-6xl font-bold text-red-600 dark:text-yellow-500 mb-8 text-center">
  {formatTime(timeLeft)}
</div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            {isPaused && timeLeft > 0 ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePaused}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
