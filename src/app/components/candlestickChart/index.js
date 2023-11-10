import React, { useEffect, useRef } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

const CandlestickChart = ({ lastMessage }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const candlesRef = useRef([]);

  // Initialize the chart and series on component mount
  useEffect(() => {
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      // localization: en,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(197, 203, 206, 0.8)",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      layout: {
        background: "#1a1d29",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.6)",
        },
      },

      priceScale: {
        borderColor: "rgba(197, 203, 206, 0.8)",
      },
    });
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      priceFormat: {
        type: "custom",
        formatter: (price) => price.toFixed(0), // This will round the price to no decimal places
      },
    });
    chartRef.current.timeScale().applyOptions({
      barSpacing: 15, // Increase or decrease this value to adjust candle width
    });
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(containerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chartRef.current.remove(); // Clean up on component unmount
      window.removeEventListener("resize", handleResize);
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

  return <div className="chart-container" ref={containerRef}></div>;
};

export default CandlestickChart;
