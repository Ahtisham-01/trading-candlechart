// AreaSeriesChart.js
import React, { useEffect, useRef } from 'react';
import { createChart, PriceScaleMode, en , CrosshairMode } from 'lightweight-charts';

const AreaSeriesChart = ({lastMessage}) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);



  useEffect(() => {
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
      topColor: 'rgba(67, 83, 254, 0.7)',
      bottomColor: 'rgba(67, 83, 254, 0.3)',
      lineColor: 'rgba(67, 83, 254, 1)',
      lineWidth: 2,
    });

    return () => {
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;
    const data = JSON.parse(lastMessage.data);
    if (!data || !data.data) return;

    const [timeStr, , , closeStr] = data.data[0];
    const newPoint = {
      time: parseInt(timeStr, 10) / 1000,
      value: parseFloat(closeStr),
    };

    // Here you can implement logic to manage the data points, similar to how you did with the candlestick chart
    // For simplicity, we will just set the new point for now
    areaSeriesRef.current.update(newPoint);
  }, [lastMessage?.data]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(containerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div className="chart-container" ref={containerRef}></div>;
};

export default AreaSeriesChart;
