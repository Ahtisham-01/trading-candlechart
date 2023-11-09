import React, { useEffect, useRef, useState } from "react";
import { createChart, en, CrosshairMode } from "lightweight-charts";

const AreaSeriesChart11 = ({ lastMessage }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);
  const [lastData, setLastData] = useState(null);
  // Add state to store the previous value for interpolation
  //  const [prevData, setPrevData] = useState({ time: 0, value: 0 });
  const [markers, setMarkers] = useState([]);
  const tooltipRef = useRef(null); // Ref for the tooltip element

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
      localization: en,
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
        param.time
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
        containerRef.current.removeChild(tooltipRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;

    const data = JSON.parse(lastMessage.data);
    if (!data || !data.data) return;

    const [timeStr, , , , closeStr] = data.data[0];
    // const time = Math.floor(new Date(timeStr).getTime() / 1000);
    const now = Date.now();
    const time = Math.floor(now / 1000);
    const value = parseFloat(closeStr);

    const newPoint = { time: time, value: value };

    areaSeriesRef.current.update(newPoint);

    setLastData(newPoint);
    chartRef.current.timeScale().scrollToPosition(2, false);
  }, [lastMessage?.data]);

  useEffect(() => {
    if (!lastData || !areaSeriesRef.current) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const time = Math.floor(now / 1000);

      // Random walk for the value to simulate live changes
      const randomWalk = lastData.value + (Math.random() - 0.5) * 0.1;

      // Update the chart with the new value
      const newValue = { time: time, value: randomWalk };

      areaSeriesRef.current.update(newValue);
      setLastData(newValue);

      setMarkers([
        {
          time: time,
          position: "inBar",
          color: "blue",
          shape: "circle",
          id: `marker-${time}`,
        },
      ]);
    }, 1); // Update the chart every 100 milliseconds (adjust this interval as needed)

    return () => clearInterval(interval);
  }, [lastData, areaSeriesRef]);

  useEffect(() => {
    // Apply markers to the chart
    if (areaSeriesRef.current && markers.length > 0) {
      areaSeriesRef.current.setMarkers(markers);
    }
  }, [markers]);
  return (
    <div className="chart-container relative z-0" ref={containerRef}></div>
  );
};

export default AreaSeriesChart11;
