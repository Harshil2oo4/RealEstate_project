import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-hot-toast';
import { MdEdit, MdEmail } from 'react-icons/md';
import { FaBookmark, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0
  });

  useEffect(() => {
    if (user) {
      // Try to get saved name, image and banner from localStorage first
      const savedName = localStorage.getItem(`user_name_${user.email}`);
      const savedImage = localStorage.getItem(`user_image_${user.email}`);
      const savedBanner = localStorage.getItem(`user_banner_${user.email}`);
      setName(savedName || user.name || '');
      setImage(savedImage || user.picture || '');
      setBanner(savedBanner || '');
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = await getAccessTokenSilently();
      const [bookingsRes, favoritesRes] = await Promise.all([
        fetch('http://localhost:8000/api/user/allBookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email })
        }),
        fetch('http://localhost:8000/api/user/allFav', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email })
        })
      ]);

      const [bookingsData, favoritesData] = await Promise.all([
        bookingsRes.json(),
        favoritesRes.json()
      ]);

      setStats({
        totalBookings: bookingsData?.bookedVisits?.length || 0,
        totalFavorites: favoritesData?.favResidenciesID?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an image element to get dimensions
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions (max 800px width/height)
          const maxSize = 800;
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImage(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image. Please try again.');
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Banner file selected:', file.name);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Banner file read successfully');
        // Create an image element to get dimensions
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          console.log('Banner image loaded, processing...');
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions (maintain aspect ratio, max width 1200px)
          const maxWidth = 1200;
          if (width > maxWidth) {
            height = Math.floor(height * (maxWidth / width));
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with higher compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // Increased compression
          
          // Check final size
          const finalSize = compressedBase64.length;
          console.log('Compressed banner size:', finalSize);
          
          if (finalSize > 1000000) { // If still larger than ~1MB
            toast.error('Image is too large after compression. Please try a smaller image.');
            return;
          }

          console.log('Banner processed, setting state...');
          setBanner(compressedBase64);
          toast.success('Banner image selected successfully');
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing banner:', error);
      toast.error('Error processing banner image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);
    let token;
    try {
      token = await getAccessTokenSilently();
      
      // Prepare the update data
      const updateData = {
        email: user.email,
        name: name.trim(),
        image: image || user.picture,
        banner: banner || null // Ensure banner is included even if null
      };

      console.log('Sending update request with data:', {
        ...updateData,
        banner: updateData.banner ? 'base64_data' : null
      });

      const response = await fetch('http://localhost:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      console.log('Content-Type header:', contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server is not responding correctly. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Save data to localStorage
      localStorage.setItem(`user_name_${user.email}`, data.user.name);
      localStorage.setItem(`user_image_${user.email}`, data.user.image);
      if (data.user.banner) {
        localStorage.setItem(`user_banner_${user.email}`, data.user.banner);
      } else {
        localStorage.removeItem(`user_banner_${user.email}`);
      }
      
      // Update local state with the response data
      setName(data.user.name);
      setImage(data.user.image);
      setBanner(data.user.banner || '');
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        toast.error('Unable to connect to the server. Please make sure the backend server is running.');
      } else if (error.message.includes('User not found')) {
        toast.error('User account not found. Please try logging in again.');
      } else if (error.message.includes('Server is not responding correctly')) {
        toast.error('Server error. Please make sure the backend server is running at http://localhost:8000');
      } else if (error.message.includes('login_required')) {
        toast.error('Please log in again to update your profile.');
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
      }

      // Log additional details for debugging
      console.log('User data:', user);
      console.log('Auth token status:', token ? 'Available' : 'Not available');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-padd-container">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-48 bg-gray-100">
            {banner && (
              <img
                src={banner}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            )}
            {isEditing && (
              <label className="absolute bottom-4 right-4 bg-secondary text-white rounded-full p-3 cursor-pointer shadow-md hover:bg-tertiary transition-colors z-10 flexCenter gap-2">
                <MdEdit size={20} />
                <span className="text-sm">Change Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  aria-label="Change banner image"
                />
              </label>
            )}
          </div>
          
          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Image */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative w-32 h-32">
                <img
                  src={image || localStorage.getItem(`user_image_${user?.email}`) || user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email)}&background=random`}
                  alt={name}
                  className="rounded-full border-4 border-white shadow-md w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email)}&background=random`;
                  }}
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-secondary text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-tertiary transition-colors">
                    <MdEdit size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-semibold text-center border-b-2 border-gray-100 focus:border-secondary outline-none px-4 py-1"
                />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-700">{name}</h1>
              )}
              <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                <MdEmail className="text-secondary" size={18} />
                <p>{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="max-w-md mx-auto grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#f8f8f8] rounded-xl p-4 text-center ring-1 ring-slate-900/5">
                <div className="flex items-center justify-center gap-2">
                  <FaBookmark className="text-secondary" size={18} />
                  <span className="text-2xl font-semibold text-gray-700">{stats.totalFavorites}</span>
                </div>
                <p className="text-gray-500 mt-1">Favorites</p>
              </div>
              <div className="bg-[#f8f8f8] rounded-xl p-4 text-center ring-1 ring-slate-900/5">
                <div className="flex items-center justify-center gap-2">
                  <FaCalendarAlt className="text-secondary" size={18} />
                  <span className="text-2xl font-semibold text-gray-700">{stats.totalBookings}</span>
                </div>
                <p className="text-gray-500 mt-1">Bookings</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              {isEditing ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-secondary rounded-full px-6 py-2"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name || '');
                      setImage(user.picture || '');
                      setBanner('');
                    }}
                    className="btn-secondary-outline rounded-full px-6 py-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary rounded-full px-6 py-2"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 