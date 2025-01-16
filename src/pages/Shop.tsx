import React from 'react';
import { useParams } from 'react-router-dom';
import { useShopStore } from '../store/shop';

export const Shop = () => {
  const { id } = useParams();
  const { shops, products, loadProducts } = useShopStore();
  const shop = shops.find(s => s.id === id);

  React.useEffect(() => {
    if (id) {
      loadProducts(id);
    }
  }, [id]);

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Shop not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
        <p className="mt-2 text-gray-600">{shop.address}</p>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-gray-600">{shop.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-gray-600">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  onClick={() => {
                    // Add to cart functionality will be implemented later
                  }}
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Stock: {product.stock}
              </div>
              {product.expiryDate && (
                <div className="mt-1 text-sm text-gray-600">
                  Expires: {new Date(product.expiryDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};