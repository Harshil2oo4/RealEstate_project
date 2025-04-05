import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import StatCard from './components/StatCard';
import PropertyTable from './components/PropertyTable';
import Terms from "./components/terms";
import { PointOfSaleIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch properties
        const propertiesRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/residency/allresd`);
        const propertiesData = await propertiesRes.json();
        
        setProperties(propertiesData);
        
        // Calculate stats
        const totalRevenue = propertiesData.reduce((acc, curr) => acc + curr.price, 0);
        
        setStats({
          totalProperties: propertiesData.length,
          totalRevenue,
          totalUsers: 0,
          totalBookings: 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon="🏠"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📅"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={
            <PointOfSaleIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>
        <PropertyTable properties={properties} />
      </div>
    </div>
  );
};

export default Dashboard;