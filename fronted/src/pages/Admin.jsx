import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { deleteProperty, updateProperty, getAllFav, getAllBookings } from '../utils/api';
import EditPropertyModal from '../components/EditPropertyModal';
import AdminPieCharts from '../components/AdminPieCharts';
import { FaEdit, FaTrash, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeartBtn from '../components/HeartBtn';

const Admin = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalFavorites: 0
  });

  // Check for admin role
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const token = await getAccessTokenSilently();
        
        const response = await fetch('http://localhost:8000/api/user/isAdmin', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email })
        });

        if (!response.ok) {
          throw new Error('Failed to verify admin status');
        }

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:8000/api/user/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, getAccessTokenSilently]);

  // Fetch properties with React Query
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery(
    'properties',
    async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/api/residency/allresd`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    {
      enabled: isAuthenticated && isAdmin,
      staleTime: 300000,  // 5 minutes
      cacheTime: 600000,  // 10 minutes
      refetchOnWindowFocus: false
    }
  );

  // Fetch favorites with React Query
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery(
    ['favorites', user?.email],
    async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/api/user/allFav`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: user?.email })
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      return data?.favResidenciesID || [];
    },
    {
      enabled: isAuthenticated && !!user?.email,
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      refetchOnWindowFocus: false
    }
  );

  // Fetch bookings with React Query
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery(
    ['bookings', user?.email],
    async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/api/user/allBookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: user?.email })
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      return data?.bookedVisits || [];
    },
    {
      enabled: isAuthenticated && !!user?.email,
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      refetchOnWindowFocus: false
    }
  );

  // Update stats when data changes
  useEffect(() => {
    if (propertiesData) {
      const uniqueUsers = new Set(propertiesData.map(property => property.userEmail)).size;
      
      setStats({
        totalProperties: propertiesData.length,
        totalUsers: uniqueUsers,
        totalBookings: bookingsData?.length || 0,
        totalFavorites: favoritesData?.length || 0
      });
      
      setProperties(propertiesData);
    }
  }, [propertiesData, favoritesData, bookingsData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await deleteProperty(id, token);

      // Update local state
      setProperties(properties.filter(property => property.id !== id));
      setStats(prev => ({
        ...prev,
        totalProperties: prev.totalProperties - 1,
        totalUsers: new Set(properties.filter(p => p.id !== id).map(p => p.userEmail)).size
      }));

      // Invalidate the properties query to trigger a refetch
      await queryClient.invalidateQueries('properties');

      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property. Please try again.');
    }
  };

  const handleEdit = (property) => {
    console.log('Editing property:', {
      id: property.id,
      fullProperty: property
    });
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const token = await getAccessTokenSilently();
      
      console.log('Editing property:', {
        id: editingProperty.id,
        currentData: editingProperty,
        updatedData
      });

      // Ensure price is a number and all required fields are present
      const formattedData = {
        ...updatedData,
        price: parseFloat(updatedData.price),
        userEmail: editingProperty.userEmail, // Preserve the owner
      };

      // Validate required fields (excluding image-related fields)
      const requiredFields = ['title', 'description', 'price', 'address', 'city', 'country'];
      const missingFields = requiredFields.filter(field => !formattedData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // If no new images were uploaded, keep the existing ones
      if (!formattedData.images || formattedData.images.length === 0) {
        formattedData.images = editingProperty.images || [];
        formattedData.image = editingProperty.image || '';
      }

      console.log('Sending formatted data:', formattedData);

      const result = await updateProperty(editingProperty.id, formattedData, token);

      // Update local state
      setProperties(properties.map(property => 
        property.id === editingProperty.id 
          ? { ...property, ...formattedData }
          : property
      ));

      // Invalidate all related queries
      queryClient.invalidateQueries('properties');
      queryClient.invalidateQueries(['property', editingProperty.id]);
      queryClient.invalidateQueries('allProperties');
      
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries('properties'),
        queryClient.refetchQueries(['property', editingProperty.id]),
        queryClient.refetchQueries('allProperties')
      ]);

      setIsEditModalOpen(false);
      setEditingProperty(null);
      toast.success('Property updated successfully');
    } catch (error) {
      console.error('Error in handleSaveEdit:', {
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      toast.error('Failed to update property. Please try again.');
    }
  };

  // Handle unauthorized access
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-xl text-gray-600 mb-4">Please login to access the dashboard</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-500 mb-4">Access Denied</p>
        <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-500 mb-2">Error loading dashboard</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-600">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Properties</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.totalProperties}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Favorites</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.totalFavorites}</p>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Users Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Properties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover bg-gray-100" 
                              src={user.image || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`} 
                              alt={user.name || 'User avatar'}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`;
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || user.email.split('@')[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.isAdmin ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                <FaCrown className="mr-1 text-yellow-600" />
                                Admin
                              </span>
                              {user.email !== 'priyanklathiya5@gmail.com' && (
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to remove admin privileges from this user?')) {
                                      try {
                                        const token = await getAccessTokenSilently();
                                        const response = await fetch('http://localhost:8000/api/user/updateAdminStatus', {
                                          method: 'POST',
                                          headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({
                                            targetEmail: user.email,
                                            makeAdmin: false
                                          })
                                        });
                                        
                                        if (!response.ok) throw new Error('Failed to update admin status');
                                        
                                        // Refresh the users list
                                        const updatedUsers = users.map(u => 
                                          u.email === user.email ? { ...u, isAdmin: false } : u
                                        );
                                        setUsers(updatedUsers);
                                        toast.success('Admin privileges removed successfully');
                                      } catch (error) {
                                        console.error('Error updating admin status:', error);
                                        toast.error('Failed to update admin status');
                                      }
                                    }
                                  }}
                                  className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
                                >
                                  Remove Admin
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                                User
                              </span>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to make this user an admin?')) {
                                    try {
                                      const token = await getAccessTokenSilently();
                                      const response = await fetch('http://localhost:8000/api/user/updateAdminStatus', {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                          targetEmail: user.email,
                                          makeAdmin: true
                                        })
                                      });
                                      
                                      if (!response.ok) throw new Error('Failed to update admin status');
                                      
                                      // Refresh the users list
                                      const updatedUsers = users.map(u => 
                                        u.email === user.email ? { ...u, isAdmin: true } : u
                                      );
                                      setUsers(updatedUsers);
                                      toast.success('User promoted to admin successfully');
                                    } catch (error) {
                                      console.error('Error updating admin status:', error);
                                      toast.error('Failed to update admin status');
                                    }
                                  }
                                }}
                                className="px-2 py-1 text-sm text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
                              >
                                Make Admin
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.totalProperties} Properties
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div>{user.totalBookings} Bookings</div>
                          <div>{user.totalFavorites} Favorites</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'Not available'
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Charts */}
        <AdminPieCharts stats={stats} />

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Properties List</h2>
          {properties.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No properties found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {properties.map((property) => (
                    <tr 
                      key={property.id} 
                      className="hover:bg-gray-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="flex items-center cursor-pointer"
                            onClick={() => navigate(`/properties/${property.id}`)}
                          >
                            <div className="h-10 w-10 flex-shrink-0">
                              {Array.isArray(property.images) && property.images.length > 0 ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={property.images[0]}
                                  alt={property.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = property.image || 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              ) : property.image ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={property.image}
                                  alt={property.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-600 hover:text-blue-600">
                                {property.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {property.address && (
                            <div className="text-sm text-gray-500 mb-1">{property.address}</div>
                          )}
                          <div className="text-sm text-gray-600">{property.city || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{property.country || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          ₹{property.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
                            onClick={() => handleEdit(property)}
                          >
                            <FaEdit className="mr-1.5" />
                            Edit
                          </button>
                          <button
                            className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
                            onClick={() => handleDelete(property.id)}
                          >
                            <FaTrash className="mr-1.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingProperty && (
          <EditPropertyModal
            property={editingProperty}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingProperty(null);
            }}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Admin; 