
export interface VideoSnippet {
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
  
  export interface SearchItem {
    id: { kind: string; videoId?: string };
    snippet: VideoSnippet;
  }
  
  export interface VideoDetails {
    contentDetails: { duration: string };
    statistics: { viewCount: string };
  }
  