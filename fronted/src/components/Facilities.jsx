import React, { useState } from "react";
import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core";
import { createResidency } from "../utils/api.js";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "react-query";

const Facilities = ({ propertyDetails, setPropertyDetails, nextStep }) => {
  const [facilities, setFacilities] = useState({
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
  });
  const [loading, setLoading] = useState(false);
  const { user, getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      console.log("🔑 Retrieved Token:", token);
      
      // Ensure all required fields are present and properly formatted
      const propertyData = {
        title: propertyDetails.title || "",
        description: propertyDetails.description || "",
        price: parseInt(propertyDetails.price) || 0,
        address: propertyDetails.address || "",
        city: propertyDetails.city || "",
        country: propertyDetails.country || "",
        image: propertyDetails.image || "https://placehold.co/600x400?text=No+Image",
        images: propertyDetails.images || [propertyDetails.image].filter(Boolean),
        facilities: {
          bedrooms: facilities.bedrooms || 0,
          bathrooms: facilities.bathrooms || 0,
          parking: facilities.parking || 0
        },
        userEmail: user?.email
      };

      console.log("Sending property data:", propertyData);
      await createResidency(
        propertyData,
        token,
        user?.email
      );

      // Invalidate the properties query to trigger a refetch
      await queryClient.invalidateQueries("properties");
      
      toast.success("Residency created successfully");
      nextStep();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating residency: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={"50%"} max="auto" my={"md"}>
      <form onSubmit={handleSubmit}>
        <NumberInput
          label="Bedrooms"
          value={facilities.bedrooms}
          onChange={(value) => setFacilities({ ...facilities, bedrooms: value })}
          min={0}
        />
        <NumberInput
          label="Bathrooms"
          value={facilities.bathrooms}
          onChange={(value) => setFacilities({ ...facilities, bathrooms: value })}
          min={0}
        />
        <NumberInput
          label="Parking"
          value={facilities.parking}
          onChange={(value) => setFacilities({ ...facilities, parking: value })}
          min={0}
        />
        
        <Group position="center" mt="xl">
          <Button variant="default">Back</Button>
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;
