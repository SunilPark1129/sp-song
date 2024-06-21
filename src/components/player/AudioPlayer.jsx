import React, { useEffect, useRef, useState } from "react";
import Controller from "./Control/Controller";
import styles from "./AudioPlayer.module.css";
import { aduioFiles } from "../../lib/files";

function AudioPlayer({ keyDown }) {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [skipValue, setSkipValue] = useState(null);
  const [progress, setProgress] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMute, setIsMute] = useState(false);

  const audioRef = useRef();

  // Interacting with the car's audio player
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        setSkipValue("next");
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        setSkipValue("prev");
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying((prev) => !prev);
      });

      navigator.mediaSession.setActionHandler("seekforward", () => {
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + 10,
          audioRef.current.duration
        );
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        audioRef.current.currentTime = Math.max(
          audioRef.current.currentTime - 10,
          0
        );
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        setIsPlaying(false);
      });

      navigator.mediaSession.metadata = new MediaMetadata({
        title: aduioFiles[currentSong].title,
        artist: "Sunil Park",
        album: "Sunil Album",
        artwork: [
          {
            src: aduioFiles[currentSong].thumb,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });
    }
  }, []);

  useEffect(() => {
    if (keyDown === "pause") {
      setIsPlaying((prev) => !prev);
    } else if (keyDown === "prev") {
      setSkipValue("prev");
    } else if (keyDown === "next") {
      setSkipValue("next");
    } else if (keyDown === "mute") {
      setIsMute((prev) => !prev);
    } else if (keyDown === "volumeUp") {
      setVolume((prev) =>
        Number(prev) + 0.1 >= 1 ? "1" : String(Number(prev) + 0.1)
      );
    } else if (keyDown === "volumeDown") {
      setVolume((prev) =>
        Number(prev) - 0.1 <= 0 ? "0" : String(Number(prev) - 0.1)
      );
    }
  }, [keyDown]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (skipValue === "prev") {
      const ct = audioRef.current.currentTime;
      if (ct > 5) {
        audioRef.current.currentTime = 0;
        return;
      }
      let next = currentSong - 1;
      if (currentSong === 0) {
        next = aduioFiles.length - 1;
      }
      setCurrentSong(next);
    } else if (skipValue === "next") {
      let next = currentSong + 1;
      if (currentSong === aduioFiles.length - 1) {
        next = 0;
      }
      setCurrentSong(next);
    }

    return () => {
      setSkipValue(null);
    };
  }, [skipValue]);

  function onPlaying() {
    const duration = Number.isNaN(audioRef.current.duration)
      ? 1
      : audioRef.current.duration;
    const ct = audioRef.current.currentTime;
    const date = new Date(0);
    date.setUTCSeconds(duration);
    const minutes = date.getUTCMinutes();
    const sec = date.getUTCSeconds();
    const totalTimes = `${String(minutes).padStart(1, "0")}:${String(
      sec
    ).padStart(2, "0")}`;

    const currDate = new Date(0);
    currDate.setUTCSeconds(ct);
    const currMinutes = currDate.getUTCMinutes();
    const currSec = currDate.getUTCSeconds();
    const currentTimes = `${String(currMinutes).padStart(1, "0")}:${String(
      currSec
    ).padStart(2, "0")}`;

    setProgress({
      current: currentTimes,
      percentage: Math.round((ct / duration) * 100),
      length: totalTimes,
      now: ct,
      total: duration,
    });
  }

  useEffect(() => {
    const handleMetadataLoad = () => {
      onPlaying(audioRef.current.currentTime);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", handleMetadataLoad);

      return () => {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleMetadataLoad
        );
      };
    }
  }, [audioRef]);

  useEffect(() => {
    if (volume === "0") {
      setIsMute(true);
    } else {
      audioRef.current.volume = volume;
      setIsMute(false);
    }
  }, [volume]);

  useEffect(() => {
    if (volume === "0" && !isMute) {
      setVolume(0.5);
    }
    audioRef.current.muted = isMute;
  }, [isMute]);

  return (
    <div className={styles.container}>
      <audio
        src={aduioFiles[currentSong].url}
        ref={audioRef}
        onTimeUpdate={onPlaying}
        onEnded={() => setSkipValue("next")}
      />
      {progress && (
        <Controller
          aduioFiles={aduioFiles}
          title={aduioFiles[currentSong].title}
          thumb={aduioFiles[currentSong].thumb}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setSkipValue={setSkipValue}
          progress={progress}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          volume={volume}
          setVolume={setVolume}
          isMute={isMute}
          setIsMute={setIsMute}
          audioRef={audioRef}
          lyrics={aduioFiles[currentSong].lyrics}
        />
      )}
    </div>
  );
}

export default AudioPlayer;
