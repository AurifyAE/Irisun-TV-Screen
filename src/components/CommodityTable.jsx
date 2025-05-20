import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const CommodityTable = ({ commodities }) => {
  const { goldData, silverData } = useSpotRate();

  // Helper function to get bid and ask values based on metal type
  const getBidAskValues = (metal) => {
    if (
      metal === "gold" ||
      metal === "gold kilobar" ||
      metal === "gold ten tola"
    ) {
      return {
        bid: parseFloat(goldData.bid) || 0,
        ask: parseFloat(goldData.ask) || 0,
      };
    } else if (metal === "silver") {
      return {
        bid: parseFloat(silverData.bid) || 0,
        ask: parseFloat(silverData.ask) || 0,
      };
    }
    return { bid: 0, ask: 0 };
  };

  // Helper function to calculate purity power
  const calculatePurityPower = (purityInput) => {
    if (!purityInput || isNaN(purityInput)) return 1;
    return purityInput / Math.pow(10, purityInput.toString().length);
  };

  // Helper function to conditionally round values
  const formatValue = (value, weight) => {
    return weight === "GM" ? value.toFixed(2) : Math.round(value);
  };

  // Helper function to format commodity display
  const formatCommodityDisplay = (commodity) => {
    const { metal, purity, unit, weight, label } = commodity;

    // Format metal name
    const metalName =
      metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase();

    // Add karat information for gold if available
    let purityDisplay = purity;
    if (metal.toLowerCase() === "gold" && label) {
      purityDisplay = `${purity} (${label})`;
    }

    // Special case for Silver Kilobar
    if (metal.toLowerCase() === "silver" && weight === "KG") {
      return `Silver Kilobar – ${unit}${weight}`;
    }

    return `${metalName} - ${purityDisplay}`;
  };

  // Function to sort and organize commodities in the specified order
  const organizeAndSortCommodities = (commoditiesList) => {
    // Define all required commodities with default values
    const requiredCommodities = [
      {
        id: "gold-9999",
        metal: "gold",
        purity: "9999",
        label: "24k",
        unit: 1,
        weight: "GM",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
      {
        id: "gold-880",
        metal: "gold",
        purity: "880",
        unit: 1,
        weight: "GM",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
      {
        id: "gold-875",
        metal: "gold",
        purity: "875",
        label: "21k",
        unit: 1,
        weight: "GM",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
      {
        id: "gold-775",
        metal: "gold",
        purity: "775",
        unit: 1,
        weight: "GM",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
      {
        id: "gold-750",
        metal: "gold",
        purity: "750",
        label: "18k",
        unit: 1,
        weight: "GM",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
      {
        id: "silver-kilobar",
        metal: "silver",
        purity: "999",
        unit: 1,
        weight: "KG",
        buyCharge: 0,
        sellCharge: 0,
        buyPremium: 0,
        sellPremium: 0,
      },
    ];

    // Create a map to look up commodities quickly
    const commodityMap = {};
    commoditiesList.forEach((commodity) => {
      // Generate a key based on metal and purity (and weight for silver)
      let key;
      if (
        commodity.metal.toLowerCase() === "silver" &&
        commodity.weight === "KG"
      ) {
        key = "silver-kilobar";
      } else {
        key = `${commodity.metal.toLowerCase()}-${commodity.purity}`;
      }
      commodityMap[key] = commodity;
    });

    // Create the final array, using API data if available, otherwise use hardcoded defaults
    const result = requiredCommodities.map((defaultItem) => {
      const key = defaultItem.id;
      const apiCommodity = commodityMap[key];

      if (apiCommodity) {
        // If the API provided the commodity, use it but ensure it has the label
        return {
          ...apiCommodity,
          label: defaultItem.label,
        };
      } else {
        // Otherwise use the default hardcoded values
        return defaultItem;
      }
    });

    return result;
  };

  // Sort and organize commodities according to the specified order
  const organizedCommodities = organizeAndSortCommodities(commodities);

  return (
    <TableContainer
      sx={{
        backgroundColor: "transparent",
        marginTop: "0px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background:
                "linear-gradient(to right, #BC9459 28%, #B48A4E 51%, #A7783B 71%, #A07234 100%);",
              "& th:first-of-type": {
                borderTopLeftRadius: "20px",
              },
              "& th:last-of-type": {
                borderTopRightRadius: "20px",
              },
              "& th": {
                borderBottom: "none",
              },
            }}
          >
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5vw",
                textAlign: "center",
                padding: "10px",
              }}
            >
              COMMODITY
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5vw",
                textAlign: "center",
                padding: "10px",
              }}
            >
              UNIT
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              BID (AED)
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              ASK (AED)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizedCommodities.map((commodity, index) => {
            const { bid, ask } = getBidAskValues(commodity.metal.toLowerCase());
            const {
              unit,
              weight,
              buyCharge,
              sellCharge,
              buyPremium,
              sellPremium,
              purity,
            } = commodity;

            // Ensure all values are numbers
            const unitMultiplier =
              {
                GM: 1,
                KG: 1000,
                TTB: 116.64,
                TOLA: 11.664,
                OZ: 31.1034768,
              }[weight] || 1;

            const purityValue = parseFloat(purity) || 0;
            const purityPower = calculatePurityPower(purityValue);
            const buyChargeValue = parseFloat(buyCharge) || 0;
            const sellChargeValue = parseFloat(sellCharge) || 0;
            const buyPremiumValue = parseFloat(buyPremium) || 0;
            const sellPremiumValue = parseFloat(sellPremium) || 0;

            const biddingValue = bid + buyPremiumValue;
            const askingValue = ask + sellPremiumValue;
            const biddingPrice = (biddingValue / 31.103) * 3.674;
            const askingPrice = (askingValue / 31.103) * 3.674;

            // Calculation of buyPrice and sellPrice
            const buyPrice =
              biddingPrice * unitMultiplier * unit * purityPower +
              buyChargeValue;
            const sellPrice =
              askingPrice * unitMultiplier * unit * purityPower +
              sellChargeValue;

            const isLastRow = index === organizedCommodities.length - 1;
            return (
              <React.Fragment key={index}>
                <TableRow
                  key={commodity.id || index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#E9E9E9" : "#EADECD",
                    "& td": {
                      borderBottom: "none",
                    },
                    "& td:first-of-type": {
                      borderBottomLeftRadius: isLastRow ? "20px" : 0,
                    },
                    "& td:last-of-type": {
                      borderBottomRightRadius: isLastRow ? "20px" : 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "1.8vw",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "12px 30px",
                    }}
                  >
                    {formatCommodityDisplay(commodity)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "1.7vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    {unit}{weight}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    {formatValue(buyPrice, weight)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    {formatValue(sellPrice, weight)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommodityTable;
