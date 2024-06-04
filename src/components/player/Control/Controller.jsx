import React, { useEffect, useRef, useState } from "react";
import styles from "./Controller.module.css";
import {
  AiFillCaretRight,
  AiOutlinePause,
  AiFillStepBackward,
  AiFillStepForward,
  AiFillSound,
  AiFillMuted,
} from "react-icons/ai";
import { MdLyrics } from "react-icons/md";

function Controller({
  aduioFiles,
  title,
  isPlaying,
  setIsPlaying,
  setSkipValue,
  progress,
  thumb,
  currentSong,
  setCurrentSong,
  volume,
  setVolume,
  isMute,
  setIsMute,
  audioRef,
  lyrics,
}) {
  const textareaRef = useRef(null);
  const [hasOpenedLyrics, setHasOpenedLyrics] = useState(false);
  const currentBar = 100 - progress.percentage;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
    }
  }, [currentSong]);

  function progressChangeHandler(e) {
    audioRef.current.currentTime = Number(e.target.value);
  }
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.imgContainer}>
          <img src={thumb} alt={title} />
        </div>
        <ul className={styles.musicLists}>
          {aduioFiles.map((item, idx) => (
            <li
              key={idx}
              className={`${item.title === title && styles.activated}`}
              onClick={() => setCurrentSong(idx)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      {hasOpenedLyrics && (
        <textarea
          ref={textareaRef}
          readOnly
          className={styles.lyrics}
          value={lyrics}
        ></textarea>
      )}
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressWrapper}>
          <p>{progress.current}</p>
          <p>{progress.length}</p>
          <div className={styles.progressCover}>
            <div
              className={styles.progressFill}
              style={{ right: `calc(${currentBar}% - 2px)` }}
            ></div>
            <input
              className={`${styles.progressBar}`}
              onKeyDown={(e) => e.preventDefault()}
              type="range"
              min="0"
              max={progress.total}
              step="0.01"
              value={progress.now}
              onChange={progressChangeHandler}
            />
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button
          onClick={() => setSkipValue("prev")}
          className={`${styles.btn}`}
          title="prev"
        >
          <AiFillStepBackward />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`${styles.btn}`}
          title="pause"
        >
          {isPlaying ? <AiOutlinePause /> : <AiFillCaretRight />}
        </button>
        <div className={styles.sound}>
          <button
            className={`${styles.btn}`}
            onClick={() => setIsMute((prev) => !prev)}
            title="mute"
          >
            {isMute ? <AiFillMuted /> : <AiFillSound />}
          </button>
          <div className={styles.soundGroup}>
            <input
              className={`${styles.soundBar} ${
                isMute && styles.soundActivated
              }`}
              onKeyDown={(e) => e.preventDefault()}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
            <div
              className={`${styles.soundFill} ${
                isMute && styles.soundActivated
              }`}
              style={{ right: `${100 - volume * 100}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => setSkipValue("next")}
          className={`${styles.btn}`}
          title="next"
        >
          <AiFillStepForward />
        </button>
        <button
          className={`${styles.btn} ${
            !hasOpenedLyrics && styles.lyricsNotActivated
          }`}
          onClick={() => setHasOpenedLyrics((prev) => !prev)}
          title="display lyrics"
        >
          <MdLyrics />
        </button>
      </div>
      <h1 className={styles.dev}>AI Album - Sunil Park</h1>
    </div>
  );
}

export default Controller;
