import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import image1 from "../assets/image4.jpg";
import image2 from "../assets/image5.jpg";
import image3 from "../assets/image6.jpg";

const images = [image1, image2, image3];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <Box
      sx={{
        width: "25%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "95%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`Carousel image ${currentIndex + 1}`}
          className="w-full h-48 rounded-[25px] mb-3 object-fit"
        />
      </Box>
    </Box>
  );
};

export default Carousel;
