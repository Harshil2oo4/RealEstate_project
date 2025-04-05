// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BLOGS } from '../constant/data';

// const Blog = () => {
//   const navigate = useNavigate();

//   return (
//     <section className="max-padd-container">
//       <div className="max-padd-container py-16 xl:py-28 rounded-3xl">
//         <span className="medium-18">Stay Updated with Latest News!!!</span>
//         <h2 className="h2">Our Expert Blogs</h2>
//         {/* Container for the blogs */}
//         <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-24">
//           {BLOGS.map((blog, index) => (
//             <div
//               key={blog.title}
//               className="rounded-3xl border-[11px] border-primary shadow-sm overflow-hidden relative"
//             >
//               {/* Ensure the image source is valid */}
//               <img src={blog.image} alt={blog.title} className="w-full h-auto" />
//               <div className="absolute top-0 left-0 h-full w-full bg-black/25"></div>
//               <div className="absolute bottom-4 left-4 text-white text-[15px]">
//                 <h3 className="font-[600] text-[16px] pr-4 leading-5">{blog.title}</h3>
//                 <h4 className="medium-14 pb-3 pt-1">{blog.category}</h4>
//                 <button
//                   className="bg-white rounded-xl font-semibold text-tertiary px-3 py-1"
//                   onClick={() => navigate(`/blog/${index}`)} // Corrected the string format here
//                 >
//                   Continue reading
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Blog;


import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { BLOGS } from '../constant/data';
  import Slider from 'react-slick';
//   import 'slick-carousel/slick/slick.css';
  import "slick-carousel/slick/slick.css"
  // import 'slick-carousel/slick/slick-theme.css';
  import "slick-carousel/slick/slick-theme.css"
  
  const Blog = () => {
    const navigate = useNavigate();
  
    const settings = {
      infinite: true, // Loop the slides
      speed: 500, // Transition speed
      slidesToShow: 4, // Number of visible slides
      slidesToScroll: 1, // Number of slides to scroll at once
      swipe: true, // Enable swipe gesture
      draggable: true, // Allow dragging on desktop
      arrows: true, // Show navigation arrows
      dots: false, // Hide dots for pagination
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };
  
    return (
      <section className="max-padd-container">
        <div className="max-padd-container py-16 xl:py-28 rounded-3xl">
          <span className="medium-18">Stay Updated with Latest News!!!</span>
          <h2 className="h2">Our Expert Blogs</h2>
          {/* Slider for the blogs */}
          <Slider {...settings} className="mt-12">
            {BLOGS.map((blog, index) => (
              <div
                key={blog.title}
                className="rounded-3xl border-[11px] border-primary shadow-sm overflow-hidden relative px-2"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-auto"
                />
                <div className="absolute top-0 left-0 h-full w-full bg-black/25"></div>
                <div className="absolute bottom-4 left-4 text-white text-[15px]">
                  <h3 className="font-[600] text-[16px] pr-4 leading-5">
                    {blog.title}
                  </h3>
                  <h4 className="medium-14 pb-3 pt-1">{blog.category}</h4>
                  <button
                    className="bg-white rounded-xl font-semibold text-tertiary px-3 py-1"
                    onClick={() => navigate(`/blog/${index}`)}
                  >
                    Continue reading
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    );
  };
  
  export default Blog;