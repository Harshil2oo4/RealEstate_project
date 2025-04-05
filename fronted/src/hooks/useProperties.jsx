import React from 'react'
import { useQuery } from 'react-query';
import { getAllProperties } from '../utils/api.js';

const useProperties = () => {
  const { data = [], isError, isLoading, refetch } = useQuery(
    "properties",
    getAllProperties,
    { 
      refetchOnWindowFocus: false,
      staleTime: 300000,  // 5 minutes
      cacheTime: 600000,  // 10 minutes
    }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useProperties;