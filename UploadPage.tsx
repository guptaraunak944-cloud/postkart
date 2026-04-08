import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, Film, Upload as UploadIcon } from 'lucide-react';

type UploadType = 'product' | 'reel';

export default function UploadPage() {
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState<UploadType>('product');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [reelVideo, setReelVideo] = useState('');
  const [reelCaption, setReelCaption] = useState('');

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name: productName,
        price: parseFloat(productPrice),
        image_url: productImage,
        whatsapp_number: whatsappNumber,
      });

      if (error) throw error;

      setSuccess(true);
      setProductName('');
      setProductPrice('');
      setProductImage('');
      setWhatsappNumber('');
    } catch (err) {
      console.error(err);
      alert('Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  const handleReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('reels').insert({
        user_id: user.id,
        video_url: reelVideo,
        caption: reelCaption,
      });

      if (error) throw error;

      setSuccess(true);
      setReelVideo('');
      setReelCaption('');
    } catch (err) {
      console.error(err);
      alert('Failed to upload reel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-4">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Content</h1>

        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setUploadType('product')}
            className={`flex-1 py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
              uploadType === 'product'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            <Package size={20} />
            Product
          </button>
          <button
            onClick={() => setUploadType('reel')}
            className={`flex-1 py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
              uploadType === 'reel'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            <Film size={20} />
            Reel
          </button>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
            Successfully uploaded!
          </div>
        )}

        {uploadType === 'product' ? (
          <form onSubmit={handleProductSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UploadIcon size={20} />
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReelSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={reelVideo}
                onChange={(e) => setReelVideo(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                value={reelCaption}
                onChange={(e) => setReelCaption(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Write a caption..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UploadIcon size={20} />
              {loading ? 'Uploading...' : 'Upload Reel'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
