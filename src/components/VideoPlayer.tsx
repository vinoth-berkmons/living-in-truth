import type { VideoSource, VideoFormat } from '@/types/entities';

interface VideoPlayerProps {
  source: VideoSource;
  format: VideoFormat;
}

export const VideoPlayer = ({ source, format }: VideoPlayerProps) => {
  const isShort = format === 'short';

  if (source.provider === 'youtube' && source.youtubeId) {
    return (
      <div className={`overflow-hidden rounded-lg ${isShort ? 'mx-auto max-w-sm' : ''}`}>
        <div className={isShort ? 'aspect-[9/16]' : 'aspect-video'}>
          <iframe
            src={`https://www.youtube.com/embed/${source.youtubeId}?rel=0`}
            title="Video player"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (source.provider === 'mp4') {
    return (
      <div className={`overflow-hidden rounded-lg ${isShort ? 'mx-auto max-w-sm' : ''}`}>
        <video
          src={source.url}
          controls
          className={`w-full ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}
        />
      </div>
    );
  }

  // HLS — would need hls.js, for now show message
  if (source.provider === 'hls') {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary">
        <p className="text-muted-foreground">HLS streaming (requires hls.js integration)</p>
      </div>
    );
  }

  return null;
};
