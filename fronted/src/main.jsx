// import React from "react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { Auth0Provider } from "@auth0/auth0-react";
// import { MantineProvider } from "@mantine/core";
// import "@mantine/core/styles.css";
// import "@mantine/dates/styles.css";

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Auth0Provider
//       domain="dev-mb1spz8pskzwxfg6.us.auth0.com"
//       clientId="hhZ8NjqjbhLql717ncDzFuhfXD5SK3Ig"
//       authorizationParams={{
//         redirect_uri: "http://localhost:5173",
//       }}
//       audience="http://localhost:8000"
//       scope="openid profile email"
//     >
//       <MantineProvider>
//         <App />
//       </MantineProvider>
//     </Auth0Provider>
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-mb1spz8pskzwxfg6.us.auth0.com"
      clientId="hhZ8NjqjbhLql717ncDzFuhfXD5SK3Ig"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://localhost:8000",
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
