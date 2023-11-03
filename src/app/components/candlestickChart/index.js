import React, { useEffect, useRef } from 'react';
import { createChart, UTCTimestamp, PriceScaleMode, en } from 'lightweight-charts';

const CandlestickChart = ({ candlestickData }) => {
  const containerRef = useRef(null);
  let chart = null;

  useEffect(() => {
    chart = createChart(containerRef.current, {
    //   width: '100%', // Set the chart width to 100% to make it responsive
      height: 800,
      localization: en,
    });


      
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
    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(candlestickData);

    // Customize the price scale
    chart.applyOptions({
      priceScale: {
        mode: PriceScaleMode.Normal,
      },
    });

    // Function to update the chart's dimensions on window resize
    const handleResize = () => {
      if (chart) {
        chart.resize(containerRef.current.clientWidth, 800); // Adjust the height as needed
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    return () => {
      // Remove the resize event listener when the component unmounts
      window.removeEventListener('resize', handleResize);

      if (chart) {
        chart.remove();
      }
    };
  }, [candlestickData]);

  return <div className='chart-container' ref={containerRef}></div>;
};

export default CandlestickChart;
