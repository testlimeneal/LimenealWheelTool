import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6
};

const renderTime = (dimension, time) =>
  (dimension === "minutes" || dimension === "seconds") && (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ fontSize: "25px" }}>{time}</div>
      <div style={{fontSize:"10px"}}>{dimension}</div>
    </div>
  );

const getTimeSeconds = (time) => time % 60 | 0;
const getTimeMinutes = (time) => (time / 60) | 0;

export default function Stopwatch() {
  const endTime = Date.now() / 1000;
  const stratTime = endTime + 243248;
  const elapsedTotalTime = stratTime - endTime;

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "sans-serif",
        textAlign: "center",
        gap: 5
      }}
    >
      <CountdownCircleTimer
        {...timerProps}
        colors="#EF798A"
        duration={3600}
        size={100}
        initialRemainingTime={0}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: totalElapsedTime < elapsedTotalTime - 3600
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("minutes", getTimeMinutes(elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>

      <CountdownCircleTimer
        {...timerProps}
        colors="#218380"
        duration={60}
        size={100}
        initialRemainingTime={0}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: totalElapsedTime < elapsedTotalTime - 60
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("seconds", getTimeSeconds(elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
