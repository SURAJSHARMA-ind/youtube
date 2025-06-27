// src/components/VideoCard.tsx

import type { SearchItem, VideoDetails } from "../types/index";
import { isoToDuration } from "../helpers/Formatters";

interface Props {
  item: SearchItem;
  details?: VideoDetails;
  logo?: string;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const VideoCard = ({ item, details, logo, hovered, onMouseEnter, onMouseLeave }: Props) => {
  const { videoId } = item.id;
  const { snippet } = item;

  const duration = details ? isoToDuration(details.contentDetails.duration) : "";
  const views = details ? `${parseInt(details.statistics.viewCount).toLocaleString()} views` : "";
  const date = new Date(snippet.publishTime).toLocaleDateString("en-US");
  const live = snippet.liveBroadcastContent === "live";

  return (
    <div
      className={`card ${hovered ? "hovered" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
};

export default VideoCard;
