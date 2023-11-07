// import React, { useEffect, useRef, useState } from "react";
// import { createChart, PriceScaleMode, en } from "lightweight-charts";

// const CandlestickChart = ({ parsedMessage }) => {
//   const containerRef = useRef(null);
//   const [chart, setChart] = useState(null);
//   const [candlestickSeries, setCandlestickSeries] = useState(null);
//   const [candles, setCandles] = useState([]);

//   useEffect(() => {
//     const newChart = createChart(containerRef.current, {
//       width: containerRef.current.clientWidth,
//       height: 800,
//       localization: en,
//     });
//     setChart(newChart);
//     const newCandlestickSeries = newChart.addCandlestickSeries({
//       timeScale: {
//         timeVisible: true,
//         secondsVisible: true,
//       },
//     });
//     setCandlestickSeries(newCandlestickSeries);

//     return () => newChart.remove(); // Clean up on component unmount
//   }, []);

//   useEffect(() => {
//     if (!parsedMessage || !parsedMessage.data || !candlestickSeries) return;
//     console.log(parsedMessage.data[0][0], "pppppppppppppppp");
//     // Parse the new candle from the message
//     const newCandle = {
//       time: parseInt(parsedMessage.data[0][0], 10) / 1000, // Convert timestamp to seconds
//       open: parseFloat(parsedMessage.data[0][1]),
//       high: parseFloat(parsedMessage.data[0][2]),
//       low: parseFloat(parsedMessage.data[0][3]),
//       close: parseFloat(parsedMessage.data[0][4]),
//     };

//     // Update the candles state, removing duplicates and keeping only the data for the last 10 minutes
//     setCandles((prevCandles) => {
//       const currentTime = new Date().getTime() / 1000; // Current time in seconds
//       const tenMinutesAgo = currentTime - 600; // Time 10 minutes ago in seconds

//       // Remove outdated candles
//       let updatedCandles = prevCandles.filter(
//         (candle) => candle.time > tenMinutesAgo
//       );

//       // Check if the candle with the current timestamp already exists and update it; otherwise, add as a new candle
//       const existingIndex = updatedCandles.findIndex(
//         (candle) => candle.time === newCandle.time
//       );
//       if (existingIndex >= 0) {
//         updatedCandles[existingIndex] = newCandle;
//       } else {
//         updatedCandles.push(newCandle);
//       }

//       return updatedCandles;
//     });
//   }, [parsedMessage, candlestickSeries]);

//   useEffect(() => {
//     if (candlestickSeries && candles.length) {
//       candlestickSeries.setData(candles);
//     }
//   }, [candles, candlestickSeries]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (chart) {
//         chart.resize(containerRef.current.clientWidth, 800);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [chart]);

//   return <div className="chart-container" ref={containerRef}></div>;
// };

// export default CandlestickChart;

import React, { useEffect, useRef } from "react";
import { createChart, PriceScaleMode, en } from "lightweight-charts";
import useWebSocket, { ReadyState } from "react-use-websocket";

const CandlestickChart = () => {
  const socketUrl = "wss://wspap.okx.com:8443/ws/v5/business?brokerId=9999";
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const candlesRef = useRef([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
  });

  // Only subscribe once when the WebSocket is first opened
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log("WebSocket Connected");
      sendMessage(
        JSON.stringify({
          op: "subscribe",
          args: [{ instId: "BTC-USD-SWAP", channel: "mark-price-candle1m" }],
        })
      );
    }
  }, [readyState, sendMessage]);

  // Initialize the chart and series on component mount
  useEffect(() => {
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 800,
      localization: en,
    });
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    return () => {
      chartRef.current.remove(); // Clean up on component unmount
    };
  }, []);

  // Update candles and chart with new WebSocket messages
  useEffect(() => {
    if (!lastMessage?.data) return;

    const data = JSON.parse(lastMessage.data);
    if (!data || !data.data) return;

    const [timeStr, openStr, highStr, lowStr, closeStr] = data.data[0];
    const newCandle = {
      time: parseInt(timeStr, 10) / 1000, // Convert timestamp to seconds
      open: parseFloat(openStr),
      high: parseFloat(highStr),
      low: parseFloat(lowStr),
      close: parseFloat(closeStr),
    };

    const currentTime = Date.now() / 1000; // Current time in seconds
    const tenMinutesAgo = currentTime - 600; // Time 10 minutes ago in seconds

    // Filter out old candles and add the new one
    const updatedCandles = candlesRef.current.filter(
      (c) => c.time > tenMinutesAgo
    );
    const existingCandleIndex = updatedCandles.findIndex(
      (c) => c.time === newCandle.time
    );
    if (existingCandleIndex >= 0) {
      updatedCandles[existingCandleIndex] = newCandle; // Update existing candle
    } else {
      updatedCandles.push(newCandle); // Add new candle
    }

    candlesRef.current = updatedCandles; // Update the ref

    candlestickSeriesRef.current.setData(updatedCandles); // Update the chart
  }, [lastMessage?.data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const currentChart = chartRef.current;
      if (currentChart) {
        currentChart.resize(containerRef.current.clientWidth, 800);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div className="chart-container" ref={containerRef}></div>;
};

export default CandlestickChart;
