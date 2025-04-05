// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { BLOGS } from '../constant/data';

// const BlogDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const blogId = parseInt(id, 10); // Ensure `id` is parsed as an integer
//   const blog = BLOGS[blogId]; // Access the blog using the parsed id

//   if (!blog) return <h2>Blog not found!</h2>; // Handle invalid blog IDs

//   // Filter out the current blog from other blogs
//   const otherBlogs = BLOGS.filter((_, index) => index !== blogId);

//   return (
//     <div className="bg-gray-100 min-h-screen py-12 px-4">
//       {/* Blog Details Section */}
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row gap-8 mt-12">
//         {/* Image Section */}
//         <div className="flex-shrink-0">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="w-full lg:w-[400px] h-auto object-cover rounded-lg"
//           />
//         </div>

//         {/* Details Section */}
//         <div className="flex-grow p-6">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>

//           <p className="text-gray-600 leading-relaxed mb-6">{blog.content}</p>

//           {/* Added Lorem Ipsum Paragraph */}
//           <p className="text-gray-600 leading-relaxed mb-6">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//           </p>

//           {/* Author Section */}
//           <div className="flex items-center gap-4">
//             <img
//               src="https://via.placeholder.com/50"
//               alt="Author"
//               className="w-12 h-12 rounded-full"
//             />
//             <div>
//               <p className="text-gray-800 font-semibold">John Doe</p>
//               <p className="text-sm text-gray-500">Published on March 25, 2024</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Other Blogs Section */}
//       <div className="max-w-6xl mx-auto mt-16">
//         <h2 className="text-2xl font-semibold mb-6">Other Blogs</h2>
//         <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {otherBlogs.map((otherBlog, index) => (
//             <div
//               key={index}
//               className="rounded-3xl border-[11px] border-primary shadow-sm overflow-hidden relative"
//             >
//               <img src={otherBlog.image} alt={otherBlog.title} className="w-full h-auto" />
//               <div className="absolute top-0 left-0 h-full w-full bg-black/25"></div>
//               <div className="absolute bottom-4 left-4 text-white text-[15px]">
//                 <h3 className="font-[600] text-[16px] pr-4 leading-5">{otherBlog.title}</h3>
//                 <h4 className="medium-14 pb-3 pt-1">{otherBlog.category}</h4>
//                 <button
//                   className="bg-white rounded-xl font-semibold text-tertiary px-3 py-1"
//                   onClick={() => navigate(`/blog/${BLOGS.indexOf(otherBlog)}`)} // Fixed syntax
//                 >
//                   Continue reading
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;



import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BLOGS } from '../constant/data';
// import p1 from '../assets/icons/download.jpg'

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = BLOGS[id];

  if (!blog) return <h2>Blog not found!</h2>;

  // Filter out the current blog from other blogs
  const otherBlogs = BLOGS.filter((_, index) => index !== parseInt(id));

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      {/* Blog Details Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row gap-8 mt-12">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full lg:w-[400px] h-auto object-cover rounded-lg"
          />
        </div>

        {/* Details Section */}
        <div className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>

          <p className="text-gray-600 leading-relaxed mb-6">{blog.content}</p>

          {/* Added Lorem Ipsum Paragraph */}
          <p className="text-gray-600 leading-relaxed mb-6">
          Welcome to our Real Estate Blog — your trusted source for insights, tips, and updates in the world of property buying, selling, and investing. Whether you're a first-time homebuyer, an experienced investor, or someone just curious about the housing market, our blog offers valuable content to guide you through every step of your real estate journey. From market trends and neighborhood guides to home improvement advice and legal tips, we cover everything you need to make informed decisions. Stay updated with the latest news, explore property showcases, and gain expert opinions to help you navigate the dynamic landscape of real estate with confidence.
          </p>

          {/* Author Section */}
          <div className="flex items-center gap-4">
            {/* <img
              src= "p1"
              alt="Author"
              className="w-12 h-12 rounded-full"
            /> */}
            <div>
              <p className="text-gray-800 font-semibold">Harshil & Parth</p>
              <p className="text-sm text-gray-500">Published on March 25, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Blogs Section */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6">Other Blogs</h2>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {otherBlogs.map((otherBlog, index) => (
            <div
              key={otherBlog.title}
              className="rounded-3xl border-[11px] border-primary shadow-lg overflow-hidden relative"
            >
              <img src={otherBlog.image} alt={otherBlog.title} className="w-full h-auto" />
              <div className="absolute top-0 left-0 h-full w-full bg-black/25"></div>
              <div className="absolute bottom-4 left-4 text-white text-[15px]">
                <h3 className="font-[600] text-[16px] pr-4 leading-5">{otherBlog.title}</h3>
                <h4 className="medium-14 pb-3 pt-1">{otherBlog.category}</h4>
                <button
                  className="bg-white rounded-xl font-semibold text-tertiary px-3 py-1"
                  onClick={() =>
                    navigate(`/blog/${BLOGS.indexOf(otherBlog)}`)
                  }
                >
                  Continue reading
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
