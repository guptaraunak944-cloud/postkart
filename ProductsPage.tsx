import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (product: Product) => {
    const message = encodeURIComponent(`Hi, I'm interested in ${product.name}`);
    window.open(`https://wa.me/${product.whatsapp_number}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold">PostKart</h1>
        <p className="text-blue-100 text-sm mt-1">Discover amazing products</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {products.length === 0 ? (
          <div className="text-center text-gray-600 mt-12">
            No products yet. Be the first to upload!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ${product.price}
                  </p>
                  <button
                    onClick={() => handleWhatsApp(product)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
