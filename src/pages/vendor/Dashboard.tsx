import React, { useEffect } from 'react';
import { useShopStore } from '../../store/shop';
import { useOrderStore } from '../../store/order';
import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';

export const VendorDashboard = () => {
  const { user } = useAuthStore();
  const { shops, loadShops } = useShopStore();
  const { orders, loadOrders } = useOrderStore();

  useEffect(() => {
    if (user) {
      loadShops();
      const shop = shops[0];
      if (shop) {
        loadOrders(undefined, shop.id);
      }
    }
  }, [user]);

  const recentOrders = orders.slice(0, 5);
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Vendor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold">₹{totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold">{totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-semibold">{shops[0]?.products?.length || 0}</p>
            </div>
            <Package className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                    backgroundColor: order.status === 'delivered' ? '#DEF7EC' : 
                                  order.status === 'cancelled' ? '#FDE8E8' : '#E1EFFE',
                    color: order.status === 'delivered' ? '#03543F' :
                           order.status === 'cancelled' ? '#9B1C1C' : '#1E429F'
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ₹{order.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            to="/vendor/orders"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
};