import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const getBackgroundColor = (change) => {
    if (change === "up") {
      return "green"; // Green color for increase
    } else if (change === "down") {
      return "red"; // Red color for decrease
    }
    return ""; // White color for no change
  };

  const getColor = (change) => {
    if (change === "up") {
      return "white"; // Green color for increase
    } else if (change === "down") {
      return "white"; // Red color for decrease
    }
    return "black"; // Default color for no change
  };

  const renderSpotSection = (metal, data) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0vw",
      }}
    >
      <Box className="w-full">
        <Box className="flex flex-row justify-between bg-[#E9E9E9] rounded-[150px] w-full pr-4">
          <Box></Box>
          <Box
            className="flex flex-col justify-center rounded-[150px]"
          >
            <Typography
              className="text-black uppercase px-6"
              sx={{
                fontWeight: "bold",
                fontSize: metal === "gold" ? "2vw" : "1.7vw",
              }}
            >
              {metal}
            </Typography>
            <Typography
              className="text-black"
              sx={{
                fontWeight: "bold",
                fontSize: metal === "gold" ? "1.5vw" : "1.2vw",
                marginTop: "-5px",
              }}
            >
              OZ
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              padding: "1vw 2vw",
              width: "100%",
            }}
          >
            <Box>
              <Box className="flex flex-row items-center justify-center">
                <Typography
                  sx={{
                    fontSize: "1.2vw",
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  BID
                </Typography>
                <Box
                  className="flex justify-center items-center"
                  sx={{
                    marginLeft: "0.1vw",
                    backgroundColor: "#000000",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    fontSize: "1vw",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: "1.3vw", color: "white" }} />
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2.2vw",
                  fontWeight: "bold",
                  margin: "0.2vw 0",
                  padding: "0.2vw 0",
                  color: getColor(data.bidChanged),
                  backgroundColor: getBackgroundColor(data.bidChanged),
                  border: "2px solid black",
                  borderRadius: "10px",
                  width: "9vw",
                }}
              >
                {data.bid}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid black",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8vw",
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: "0.5vw",
                  }}
                >
                  LOW {data.low}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box className="flex flex-row items-center justify-center">
                <Typography
                  sx={{
                    fontSize: "1.2vw",
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  ASK
                </Typography>
                <Box
                  className="flex justify-center items-center"
                  sx={{
                    marginLeft: "0.1vw",
                    backgroundColor: "#000000",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    fontSize: "1vw",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: "1.3vw", color: "white" }} />
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2.2vw",
                  fontWeight: "bold",
                  margin: "0.2vw 0",
                  padding: "0.2vw 0",
                  color: getColor(data.bidChanged),
                  backgroundColor: getBackgroundColor(data.bidChanged),
                  border: "2px solid black",
                  borderRadius: "10px",
                  width: "9vw",
                }}
              >
                {data.ask}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  border: "2px solid black",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8vw",
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: "0.5vw",
                  }}
                >
                  HIGH {data.high}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      className=" mx-auto rounded-lg"
      sx={{
        maxWidth: "100%",
      }}
    >
      <Box sx={{
        // border: "2px solid #EDE2D7",
        background:
        "linear-gradient(to right, #BC9459 28%, #B48A4E 51%, #A7783B 71%, #A07234 100%);",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px"
      }}>
        <Typography sx={{
          fontSize: "2vw",
          fontWeight: "600",
          textTransform: "uppercase",
          color: "white"
        }}>Spot Rate</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "0vw", background: "#E9E9E9", padding: "10px",
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px" }}>
        {renderSpotSection("gold", goldData)}
        {renderSpotSection("silver", silverData)}
      </Box>
    </Box>
  );
};

export default SpotRate;
