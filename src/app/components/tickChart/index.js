import React, { useEffect, useRef, useState } from "react";

import { createChart, CrosshairMode } from "lightweight-charts";
import useWebSocket from "react-use-websocket";

const TickChart = ({
  tickerChannel = "index-tickers",
  tickerInstId = "BTC-USDT",
}) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);

  const markersRef = useRef([]);
  const tooltipRef = useRef(null); // Ref for the tooltip element

  const SOCKET_URL = "wss://wspap.okx.com:8443/ws/v5/public";
  const { sendMessage, lastMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log("WebSocket Connected"),
    // Will attempt to reconnect on all close events
    shouldReconnect: (closeEvent) => true,
  });

  // Send the subscription message when the component mounts
  useEffect(() => {
    const message = {
      op: "subscribe",
      args: [
        {
          channel: tickerChannel,
          instId: tickerInstId,
        },
      ],
    };
    sendMessage(JSON.stringify(message));
  }, [tickerInstId, sendMessage]);

  useEffect(() => {
    if (containerRef.current) {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      containerRef.current.appendChild(tooltip);
      tooltipRef.current = tooltip;
    }
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      // localization: en,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: "rgba(197, 203, 206, 0.8)",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      layout: {
        background: "#000000",
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
    areaSeriesRef.current = chartRef.current.addAreaSeries({
      topColor: "rgba(67, 83, 254, 0.7)",
      bottomColor: "rgba(67, 83, 254, 0.3)",
      lineColor: "rgba(67, 83, 254, 1)",
      lineWidth: 2,
      priceFormat: {
        type: "custom",
        formatter: (price) => price.toFixed(0), // This will round the price to no decimal places
      },
    });

    chartRef.current.subscribeCrosshairMove(function (param) {
      if (!param.time || param.point === undefined) {
        tooltipRef.current.style.display = "none";
        return;
      }

      const seriesData = param.seriesData.get(areaSeriesRef.current);
      if (!seriesData) {
        tooltipRef.current.style.display = "none";
        return;
      }

      tooltipRef.current.innerHTML = `Time: ${new Date(
        param.time * 1000
      ).toLocaleString()}<br>Value: ${seriesData.value}`;
      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = `${param.point.x + 20}px`;
      tooltipRef.current.style.top = `${param.point.y}px`;
    });
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(containerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chartRef.current.remove();
      window.removeEventListener("resize", handleResize);
      if (tooltipRef.current) {
        containerRef?.current?.removeChild(tooltipRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;
  
    const data = JSON.parse(lastMessage.data);
    if (!data || !data.data) return;
    const time = Math.floor(parseFloat(data?.data[0]?.ts) / 1000);
    const value = parseFloat(data?.data[0]?.idxPx);
  
    const newPoint = { time: time, value: value };
    areaSeriesRef.current.update(newPoint);
  
    // Clear the existing markers and add a new one for the latest data point
    markersRef.current = [{
      time: time,
      position: "inBar",
      color: "blue",
      shape: "circle",
      id: `marker-${time}`,
    }];
  
    areaSeriesRef.current.setMarkers(markersRef.current);
  }, [lastMessage?.data]);
  

  return (
    <div className="chart-container relative z-0" ref={containerRef}></div>
  );
};

export default TickChart;
