import { useState, useEffect, useRef, useCallback } from "react";
import type { SearchItem, VideoDetails } from "./types/index";
import { fetchYouTubeData } from "./helpers/api";
import VideoCard from "./components/VideoCard";
import "./App.css";

const SEARCH_QUERY = "programming";

const App = () => {
  const [videos, setVideos] = useState<SearchItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState<Record<string, VideoDetails>>({});
  const [channelLogos, setChannelLogos] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchYouTubeData(SEARCH_QUERY, nextPageToken);
      setVideos((prev) => [...prev, ...res.videos]);
      setNextPageToken(res.nextPageToken);
      setVideoDetails((prev) => ({ ...prev, ...res.videoDetails }));
      setChannelLogos((prev) => ({ ...prev, ...res.channelLogos }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPageToken]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) fetchData();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchData, loading]);

  const handleMouseEnter = (videoId: string) => {
    hoverTimeoutRef.current = setTimeout(() => setHovered(videoId), 1500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHovered(null);
  };

  return (
    <div className="container">
      {videos.map((item) => {
        const videoId = item.id.videoId;
        if (!videoId) return null;
        return (
          <VideoCard
            key={videoId}
            item={item}
            details={videoDetails[videoId]}
            logo={channelLogos[item.snippet.channelId]}
            hovered={hovered === videoId}
            onMouseEnter={() => handleMouseEnter(videoId)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default App;
