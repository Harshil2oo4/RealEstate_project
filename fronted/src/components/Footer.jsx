// import React, { Children } from 'react'
// import { Link } from 'react-router-dom'
// import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../constant/data'

// const Footer = () => {
//   return (
//    <footer className="max-padd-container mb-4">
//     <div className="max-padd-container bg-primary rounded-tr-3xl pt-12 xl:pt-20 pb-8">
//       <h3 className="h3">Explore Real Estate Opportunity with us?</h3>
//         <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est doloremque quaerat eligendi! </p>
//         <hr className="my-8 bg-slate-900/30 h-[2px]" />
//         {/* container */}
//         <div className="flex justify-between flex-wrap gap-x-2 gap-y-8">
//           <div className="max-w-sm">
//             <Link to={'/'} className="flex items-center gap-x-2">
//             <span className="font-[900] text-[24px]">Casa <span className="font-[600] medium-20 ">Central</span></span>
//             </Link>
//             <p className="py-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, quam!</p>
//             <div className="flexBetween pl-6 h-[3,3rem] bg-white w-full max-w-[366px] rounded-full ring-1 ring-slate-500/5">
//               <input type="email" placeholder="Enter your Email" className="bg-transparent border-none outline-none" />
//               <button className="btn-secondary rounded-full relative right-[0.33rem]">Subscribe</button>
//             </div>
//           </div>
//           <div className="flex justify-between flex-wrap gap-8">
//             {FOOTER_LINKS.map((col)=>(
//               <FooterColumn key={col.title} title={col.title}> 
//               <ul>
//                 {col.links.map((link)=>(
//                   <Link to={'/'} key={link}>{link}</Link>
//                 ))}
//               </ul>
//               </FooterColumn>
//             ))}
//             <div className="flex flex-col gap-5">
//               <FooterColumn title={FOOTER_CONTACT_INFO.title}>
//                 {FOOTER_CONTACT_INFO.links.map((link)=> (
//                   <Link to={'/'} key={link.label} className="flex gap-4 md:flex-col lg:flex-row">
//                     <p>{link.label}</p>:<p>{link.value}</p>
//                   </Link>
//                 ))}
//               </FooterColumn>
//             </div>
//             <div className="flex">
//               <FooterColumn title={SOCIALS.title}>
//                 <ul className="flex gap-4">
//                   {SOCIALS.links.map((link)=>(
//                     <Link to={'/'} key={link.id} className="text-xl">{link.icon}</Link>
//                   ))}
//                 </ul>
//               </FooterColumn>
//             </div>
//           </div>
//         </div>
//     </div>
//     {/* copyright */}
//     <p className="text-white bg-tertiary medium-14 py-2 px-8 rounded-b-3xl flexBetween"><span>2024 CasaCentral</span>All Rights Reserved</p>
//    </footer>
//   );
// };

// export default Footer;

// const  FooterColumn = ({title, Children}) => {
//   return(
//     <div className="flex flex-col gap-5">
//       <h4 className="bold-18 whitespace-nowrap">{title}</h4>
//       {Children}
//     </div>
//   );
// };


import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../constant/data';
// import Terms from './terms';
import { useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="max-padd-container mb-4 ">
      <div className="max-padd-container bg-primary rounded-tr-3xl rounded-tl-3xl pt-12 xl:pt-20 pb-8">
        <h3 className="h3">Explore Real Estate Opportunity with us?</h3>
        <p>
        "Explore top real estate listings, find your perfect home, and connect with trusted agents—effortless and reliable!"
        </p>
        <hr className="my-8 bg-slate-900/30 h-[2px]" />

        {/* Container */}
        <div className="flex justify-between flex-wrap gap-x-2 gap-y-8">
          {/* Branding Section */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-x-2">
              <span className="font-[900] text-[24px]">
                Lotus <span className="font-[600] medium-20">Nest</span>
              </span>
            </Link>
            <p className="py-4">
            "Find your dream home with ease! Explore top real estate listings, trusted agents, and seamless property transactions. Your perfect home awaits!"
            </p>
            <div className="flex items-center pl-6 h-[3.3rem] bg-white w-full max-w-[366px] rounded-full ring-1 ring-slate-500/5">
              <input
                type="email"
                placeholder="Enter your Email"
                className="bg-transparent border-none outline-none flex-1"
              />
              <button className="btn-secondary rounded-full px-4 py-3">Subscribe</button>
            </div>
          </div>
            <div className="hover:underline flex flex-col gap-2 cursor-pointer"onClick={() => navigate("/terms", { replace: true })}>Terms & Condition</div>

          {/* Footer Links */}
          <div className="flex justify-between flex-wrap gap-8">
            {FOOTER_LINKS.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className="flex flex-col gap-2 cursor-pointer cursonr-pointer">
                  {col.links.map((link) => (
                    <Link to="/" key={link} className="hover:underline">
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            {/* Contact Info */}
            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
              <ul className="flex flex-col gap-2">
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <li key={link.label} className="flex flex-col lg:flex-row gap-2">
                    <p className="font-bold">{link.label}:</p>
                    <p>{link.value}</p>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            {/* Social Links */}
            <FooterColumn title={SOCIALS.title}>
              <ul className="flex gap-4">
                {SOCIALS.links.map((link) => (
                  <a href={link.url} key={link.id} className="text-xl hover:text-secondary">
                    {link.icon}
                  </a>
                ))}
              </ul>
            </FooterColumn>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-white bg-tertiary medium-14 py-2 px-8 rounded-b-3xl flex justify-between">
        <span>2024 LotusNest</span>All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};
