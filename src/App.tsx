import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = import.meta.env.VITE_API_KEY as string;
const SEARCH_QUERY = "programming";
const MAX_RESULTS = 20;

interface VideoSnippet {
  title: string;
  channelId: string;
  channelTitle: string;
  publishTime: string;
  thumbnails: {
    high: {
      url: string;
    };
  };
  liveBroadcastContent?: string;
}

interface SearchItem {
  id: {
    kind: string;
    videoId?: string;
  };
  snippet: VideoSnippet;
}

interface VideoDetails {
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

function isoToDuration(iso: string): string {
  let hours = 0,
    mins = 0,
    secs = 0;
  iso.replace(/PT(\d+H)?(\d+M)?(\d+S)?/, (_, h, m, s) => {
    if (h) hours = parseInt(h);
    if (m) mins = parseInt(m);
    if (s) secs = parseInt(s);
    return "";
  });
  const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
  return hours ? `${hours}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`;
}

const App = () => {
  const [videos, setVideos] = useState<SearchItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [videoDetails, setVideoDetails] = useState<Record<string, VideoDetails>>({});
  const [channelLogos, setChannelLogos] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchVideos = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const searchRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          type: "video",
          maxResults: MAX_RESULTS,
          q: SEARCH_QUERY,
          key: API_KEY,
          pageToken: nextPageToken,
        },
      });

      const newVideos: SearchItem[] = searchRes.data.items;
      setNextPageToken(searchRes.data.nextPageToken);
      setVideos((prev) => [...prev, ...newVideos]);

      const videoIds = newVideos.map((v) => v.id.videoId).filter(Boolean) as string[];
      const channelIds = [...new Set(newVideos.map((v) => v.snippet.channelId))];

      const [detailsRes, channelRes] = await Promise.all([
        axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            part: "contentDetails,statistics",
            id: videoIds.join(","),
            key: API_KEY,
          },
        }),
        axios.get("https://www.googleapis.com/youtube/v3/channels", {
          params: {
            part: "snippet",
            id: channelIds.join(","),
            key: API_KEY,
          },
        }),
      ]);

      const newDetails: Record<string, VideoDetails> = {};
      detailsRes.data.items.forEach((v: any) => {
        newDetails[v.id] = v;
      });

      const newLogos: Record<string, string> = {};
      channelRes.data.items.forEach((ch: any) => {
        newLogos[ch.id] = ch.snippet.thumbnails.default.url;
      });

      setVideoDetails((prev) => ({ ...prev, ...newDetails }));
      setChannelLogos((prev) => ({ ...prev, ...newLogos }));
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  }, [nextPageToken, loading]);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
        fetchVideos();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchVideos, loading]);

  const handleMouseEnter = (videoId: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(videoId);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHovered(null);
  };

  return (
    <div className="container">
      {videos.map((item) => {
        const { videoId } = item.id;
        if (!videoId) return null;

        const { snippet } = item;
        const details = videoDetails[videoId];
        const logo = channelLogos[snippet.channelId];
        const duration = details ? isoToDuration(details.contentDetails.duration) : "";
        const views = details ? `${parseInt(details.statistics.viewCount).toLocaleString()} views` : "";
        const date = new Date(snippet.publishTime).toLocaleDateString("en-US");
        const live = snippet.liveBroadcastContent === "live";

        return (
          <div
            key={videoId}
            className={`card ${hovered === videoId ? "hovered" : ""}`}
            onMouseEnter={() => handleMouseEnter(videoId)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="thumb-container">
              <img src={snippet.thumbnails.high.url} alt="thumb" className="thumb" />
              {duration && <span className="duration">{duration}</span>}
            </div>
            <h4 className="title">{snippet.title}</h4>
            <div className="meta">
              {logo && <img src={logo} alt="logo" className="logo" />}
              <div className="info">
                <p className="channel-name">{snippet.channelTitle}</p>
                <p className="meta-line">{views} • {date}</p>
                {live && (
                  <span className="liveborder">
                    <span className="live">LIVE</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default App;
