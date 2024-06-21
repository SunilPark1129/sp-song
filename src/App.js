import { useEffect, useState } from "react";
import AudioPlayer from "./components/player/AudioPlayer";
function App() {
  const [keyDown, setKeyDown] = useState(null);
  function keyDownHandler(e) {
    if (e.key.toLowerCase() === "p") {
      setKeyDown("pause");
    } else if (e.key === "ArrowLeft") {
      setKeyDown("prev");
    } else if (e.key === "ArrowRight") {
      setKeyDown("next");
    } else if (e.key.toLowerCase() === "m") {
      setKeyDown("mute");
    } else if (e.key === "ArrowUp") {
      setKeyDown("volumeUp");
    } else if (e.key === "ArrowDown") {
      setKeyDown("volumeDown");
    }
  }
  useEffect(() => {
    return () => setKeyDown(null);
  }, [keyDown]);

  return (
    <div className="App" onKeyDown={keyDownHandler} tabIndex={0}>
      <AudioPlayer keyDown={keyDown} />
    </div>
  );
}

export default App;
