// src/api/youtube.ts

import axios from "axios";
import type{ SearchItem, VideoDetails } from "../types/index";

const API_KEY = import.meta.env.VITE_API_KEY as string;
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const MAX_RESULTS = 20;

const yt = axios.create({ baseURL: BASE_URL });

export const fetchYouTubeData = async (query: string, nextPageToken = "") => {
  const searchRes = await yt.get("/search", {
    params: {
      part: "snippet",
      type: "video",
      maxResults: MAX_RESULTS,
      q: query,
      key: API_KEY,
      pageToken: nextPageToken,
    },
  });

  const newVideos: SearchItem[] = searchRes.data.items;
  const videoIds = newVideos.map((v) => v.id.videoId).filter(Boolean) as string[];
  const channelIds = [...new Set(newVideos.map((v) => v.snippet.channelId))];

  const [videoRes, channelRes] = await Promise.all([
    yt.get("/videos", {
      params: {
        part: "contentDetails,statistics",
        id: videoIds.join(","),
        key: API_KEY,
      },
    }),
    yt.get("/channels", {
      params: {
        part: "snippet",
        id: channelIds.join(","),
        key: API_KEY,
      },
    }),
  ]);

  const videoDetails: Record<string, VideoDetails> = {};
  videoRes.data.items.forEach((v: any) => {
    videoDetails[v.id] = v;
  });

  const channelLogos: Record<string, string> = {};
  channelRes.data.items.forEach((ch: any) => {
    channelLogos[ch.id] = ch.snippet.thumbnails.default.url;
  });

  return {
    videos: newVideos,
    nextPageToken: searchRes.data.nextPageToken,
    videoDetails,
    channelLogos,
  };
};
