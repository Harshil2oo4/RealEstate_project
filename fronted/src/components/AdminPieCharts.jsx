import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const AdminPieCharts = ({ stats }) => {
  // First chart data - Users and Properties
  const usersPropertiesData = {
    labels: ['Properties', 'Users'],
    datasets: [
      {
        data: [
          stats.totalProperties,
          stats.totalUsers,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(34, 197, 94, 0.8)',  // Green
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Second chart data - Favorites and Bookings
  const favoritesBookingsData = {
    labels: ['Favorites', 'Bookings'],
    datasets: [
      {
        data: [
          stats.totalFavorites || 0,
          stats.totalBookings || 0,
        ],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(168, 85, 247, 0.8)', // Purple
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 20,
          bottom: 20
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Users & Properties Distribution</h3>
        <div className="h-[300px]">
          <Pie 
            data={usersPropertiesData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Users & Properties'
                }
              }
            }} 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Favorites & Bookings Distribution</h3>
        <div className="h-[300px]">
          <Pie 
            data={favoritesBookingsData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Favorites & Bookings'
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPieCharts; 