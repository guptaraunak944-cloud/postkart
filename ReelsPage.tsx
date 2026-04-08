import { useEffect, useState, useRef } from 'react';
import { supabase, Reel } from '../lib/supabase';
import { Heart, MessageCircle, Send, User } from 'lucide-react';

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      const { data, error } = await supabase
        .from('reels')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReels(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight;
    const index = Math.round(scrollPosition / itemHeight);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading reels...</div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center pb-20">
        <div className="text-white text-center">
          <p className="text-xl mb-2">No reels yet</p>
          <p className="text-gray-400">Be the first to upload a reel!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
    >
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          className="h-screen snap-start relative bg-black flex items-center justify-center"
        >
          <video
            src={reel.video_url}
            className="w-full h-full object-contain"
            loop
            muted
            playsInline
            autoPlay={index === currentIndex}
          />

          <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {reel.profiles?.avatar_url ? (
                    <img
                      src={reel.profiles.avatar_url}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <span className="text-white font-semibold">
                  {reel.profiles?.username || 'Anonymous'}
                </span>
              </div>

              {reel.caption && (
                <p className="text-white mb-3">{reel.caption}</p>
              )}

              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <span>{reel.views} views</span>
              </div>
            </div>
          </div>

          <div className="absolute right-4 bottom-24 flex flex-col gap-6">
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Heart className="text-white" size={24} />
              </div>
              <span className="text-white text-xs">Like</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <MessageCircle className="text-white" size={24} />
              </div>
              <span className="text-white text-xs">Comment</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Send className="text-white" size={24} />
              </div>
              <span className="text-white text-xs">Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
