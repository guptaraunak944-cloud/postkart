import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product, Reel } from '../lib/supabase';
import { User, LogOut, Package, Film } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'reels'>('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserContent();
    }
  }, [user]);

  const loadUserContent = async () => {
    if (!user) return;

    try {
      const [productsData, reelsData] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('reels')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      setProducts(productsData.data || []);
      setReels(reelsData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={32} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.username}</h2>
              <p className="text-blue-100 text-sm">{user.email}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span>{products.length} Products</span>
                <span>{reels.length} Reels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Package size={20} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 ${
              activeTab === 'reels'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Film size={20} />
            Reels
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center text-gray-600 py-12">Loading...</div>
          ) : activeTab === 'products' ? (
            products.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No products yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-green-600 font-bold">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : reels.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              No reels yet
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="aspect-[9/16] bg-gray-900 relative overflow-hidden rounded"
                >
                  <video
                    src={reel.video_url}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-xs">
                    {reel.views} views
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
