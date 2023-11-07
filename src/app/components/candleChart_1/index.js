import React, { useEffect, useRef } from "react";
import { createChart, PriceScaleMode, en } from "lightweight-charts";
import useWebSocket, { ReadyState } from "react-use-websocket";

const CandlestickChart_1 = () => {
  const socketUrl = "wss://wspap.okx.com:8443/ws/v5/business?brokerId=9999";
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const candlesRef = useRef([]);
  const areaSeriesRef = useRef(null);

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
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });
    chartRef.current.timeScale().applyOptions({
      barSpacing: 15, // Increase or decrease this value to adjust candle width
      
    });
    areaSeriesRef.current = chartRef.current.addAreaSeries({
      topColor: 'rgba(67, 83, 254, 0.7)',
      bottomColor: 'rgba(67, 83, 254, 0.3)',
      lineColor: 'rgba(67, 83, 254, 1)',
      lineWidth: 2,
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
  // Now, update both the candlestick series and the area series with the new data
  candlestickSeriesRef.current.setData(updatedCandles);
    candlestickSeriesRef.current.setData(updatedCandles); // Update the chart

    const areaSeriesData = updatedCandles.map(candle => ({
      time: candle.time,
      value: candle.close,
    }));
    
    areaSeriesRef.current.setData(areaSeriesData);
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

export default CandlestickChart_1;
