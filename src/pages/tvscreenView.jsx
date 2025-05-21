import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import LimitExceededModal from "../components/LimitExceededModal";
import SpotRate from "../components/SpotRate";
import CommodityTable from "../components/CommodityTable";
import NewsTicker from "../components/News";
import Carousel from "../components/Carousel";
import sts from "../assets/irisunLogo.jpg";
import {
  fetchSpotRates,
  fetchServerURL,
  fetchNews,
  fetchTVScreenData,
} from "../api/api";
import io from "socket.io-client";
import { useSpotRate } from "../context/SpotRateContext";

function TvScreen() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [serverURL, setServerURL] = useState("");
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState("");
  const [goldAskSpread, setGoldAskSpread] = useState("");
  const [silverBidSpread, setSilverBidSpread] = useState("");
  const [silverAskSpread, setSilverAskSpread] = useState("");
  const [symbols, setSymbols] = useState(["GOLD", "SILVER"]);
  const [error, setError] = useState(null);

  const { updateMarketData } = useSpotRate();

  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  updateMarketData(
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
          fetchNews(adminId),
        ]);

        // Handle Spot Rates
        const {
          commodities,
          goldBidSpread,
          goldAskSpread,
          silverBidSpread,
          silverAskSpread,
        } = spotRatesRes.data.info;
        setCommodities(commodities);
        setGoldBidSpread(goldBidSpread);
        setGoldAskSpread(goldAskSpread);
        setSilverBidSpread(silverBidSpread);
        setSilverAskSpread(silverAskSpread);

        // Handle Server URL
        const { serverURL } = serverURLRes.data.info;
        setServerURL(serverURL);

        // Handle News
        setNews(newsRes.data.news.news);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();

    // Fetch TV screen data (you can leave this as a separate call)
    fetchTVScreenData(adminId)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // Allow TV screen view
          setShowLimitModal(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setShowLimitModal(true); // Show the modal on 403 status
        } else {
          console.error("Error:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  }, [adminId]);

  // Function to Fetch Market Data Using Socket
  useEffect(() => {
    if (serverURL) {
      const socket = io(serverURL, {
        query: { secret: import.meta.env.VITE_APP_SOCKET_SECRET_KEY },
        transports: ["websocket"],
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
        socket.emit("request-data", symbols);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.on("market-data", (data) => {
        if (data && data.symbol) {
          setMarketData((prevData) => ({
            ...prevData,
            [data.symbol]: {
              ...prevData[data.symbol],
              ...data,
              bidChanged:
                prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                  ? data.bid > prevData[data.symbol].bid
                    ? "up"
                    : "down"
                  : null,
            },
          }));
        } else {
          console.warn("Received malformed market data:", data);
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        setError("An error occurred while receiving data");
      });

      // Cleanup function to disconnect the socket
      return () => {
        socket.disconnect();
      };
    }
  }, [serverURL, symbols]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getFormattedDateParts = (date) => {
    const day = date.toLocaleDateString("en-GB", { weekday: "long" });
    const dayOfMonth = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = date
      .toLocaleDateString("en-GB", { month: "short" })
      .toUpperCase();
    const year = date.toLocaleDateString("en-GB", { year: "numeric" });

    return {
      day,
      date: dayOfMonth,
      month,
      year,
    };
  };

  const getFormattedTimeWithoutSeconds = (date) => {
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 12-hour format
    });

    // Remove AM/PM by splitting and taking the time part
    return time.replace(/AM|PM/, "").trim();
  };

  const currentDate = new Date();
  const { day, date, month, year } = getFormattedDateParts(currentDate);
  const formattedTime = getFormattedTimeWithoutSeconds(currentDate);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box
        className="flex flex-row bg-white items-center justify-between px-10 py-4 mx-20 rounded-xl mb-5"
      >
        <Box className="flex flex-col items-center justify-between">
          <img src={sts} alt="" className="w-52 h-48 rounded-xl" />
        </Box>

        {/* Carousel */}
        {/* <Carousel /> */}

        <Box
          className="flex flex-row items-center"
          sx={{
            // backgroundColor: "rgba(255, 255, 255, 0.12)",
            backgroundColor: "#EDE2D7",
            borderRadius: "45px",
            padding: "10px 60px",
            marginLeft: "0px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              fontFamily: "montserrat, sans-serif",
              color: "black",
            }}
          >
            {day}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              fontFamily: "montserrat, sans-serif",
              marginLeft: "12px",
              color: "black",
            }}
          >
            {date}
          </Typography>

          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              marginLeft: "12px",
              fontFamily: "montserrat, sans-serif",
              color: "black",
            }}
          >
            {month.charAt(0) + month.slice(1).toLowerCase()}
          </Typography>

          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              marginLeft: "12px",
              fontFamily: "montserrat, sans-serif",
              color: "black",
            }}
          >
            {year}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              marginLeft: "16px",
              fontFamily: "montserrat, sans-serif",
              color: "black",
            }}
          >
            |
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5vw",
              fontWeight: "600",
              marginLeft: "16px",
              fontFamily: "montserrat, sans-serif",
              color: "black",
            }}
          >
            {getFormattedTimeWithoutSeconds(dateTime)}
          </Typography>
        </Box>
      </Box>

      {/* Grid */}
      <Grid
        container
        spacing={6}
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        className="px-20 py-0"
      >
        {/* Side: SpotRate */}
        <Grid item xs={12} md={5}>
          {/* SpotRate Component */}
          <SpotRate />

          <Box className="flex flex-col justify-center items-center">
            <Typography sx={{ fontSize: "1.2vw", marginTop: "30px" }}>
              Powered by www.aurify.ae
            </Typography>
          </Box>
        </Grid>

        {/* Side: Commodity Table */}
        <Grid item xs={12} md={7}>
          {/* Commodity Table */}
          <CommodityTable commodities={commodities} />
        </Grid>
      </Grid>

      {/* News Component */}
      <NewsTicker newsItems={news} />

      {/* Conditional rendering of the modal */}
      {showLimitModal && <LimitExceededModal />}
    </Box>
  );
}

export default TvScreen;
