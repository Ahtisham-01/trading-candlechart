import React, { useEffect, useRef } from 'react';
import { createChart, UTCTimestamp, PriceScaleMode, en } from 'lightweight-charts';

const CandlestickChart = ({candlestickData}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let chart = null;
    let candlestickSeries = null;

    chart = createChart(containerRef.current, {
      width: 1200,
      height: 800,
      localization: en,
    });

    candlestickSeries = chart.addCandlestickSeries();
   
    // function generateRandomDataPoint() {
    //     const time = Date.now() - Math.floor(Math.random() * 10000); // Generate a random timestamp
    //     const open = Math.random() * 100 + 50; // Random open price between 50 and 150
    //     const close = open + Math.random() * 20 - 10; // Random close price within +/- 10 of open
    //     const high = Math.max(open, close) + Math.random() * 10; // Random high price above open/close
    //     const low = Math.min(open, close) - Math.random() * 10; // Random low price below open/close
      
    //     return {
    //       time,
    //       open,
    //       high,
    //       low,
    //       close,
    //     };
    //   }
      
    //   const generateCandlestickData = (count) => {
    //     const data = [];
    //     for (let i = 0; i < count; i++) {
    //       data.push(generateRandomDataPoint());
    //     }
    //     return data;
    //   };
      
    //   const candlestickData = generateCandlestickData(100);
    //   candlestickData.sort((a, b) => a.time - b.time);
    candlestickSeries.setData(candlestickData);

    // Customize the price scale
    chart.applyOptions({
      priceScale: {
        mode: PriceScaleMode.Normal,
      },
    });

    return () => {
      if (chart) {
        chart.remove();
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default CandlestickChart;
