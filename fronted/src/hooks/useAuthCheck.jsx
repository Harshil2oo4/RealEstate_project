// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { toast } from 'react-toastify';

// const useAuthCheck = () => {
//   const { isAuthenticated } = useAuth0();

//   const validateLogin = () => {
//     if (!isAuthenticated) {
//       toast.error("You must log in to continue", { position: 'bottom-right' });
//       return false;
//     }
//     return true;
//   };

//   return {
//     validateLogin,
//   };
// };

// export default useAuthCheck;
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const useAuthCheck = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const validateLogin = () => {
    if (!isAuthenticated) {
      toast.error("You must log in to continue", { position: 'bottom-right' });
      return false;
    }
    return true;
  };

  return {
    validateLogin,
    authUser: isAuthenticated ? { email: user?.email, token: user?.sub } : null, 
  };
};

export default useAuthCheck;
