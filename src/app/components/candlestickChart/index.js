import React, { useEffect, useRef } from "react";
import {
  createChart,
  UTCTimestamp,
  PriceScaleMode,
  en,
} from "lightweight-charts";

const CandlestickChart = ({ parsedMessage }) => {
  console.log(parsedMessage, "ssssssssssssssssssssss");
  const containerRef = useRef(null);
  let chart = null;

  useEffect(() => {
    if (!parsedMessage || !parsedMessage.data) {
      return;
    }
    const [timeStr, openStr, highStr, lowStr, closeStr] = parsedMessage.data
      .map((str) => {
        console.log({ str });
        return str.map((innerStr) => parseFloat(innerStr));
      })
      .flat();
    chart = createChart(containerRef.current, {
      // width: "100%", // Set the chart width to 100% to make it responsive
      height: 800,
      localization: en,
    });

    const generateCandlestickData = (
      timestamps,
      opens,
      closes,
      highs,
      lows
    ) => {
      const data = [];
      for (let i = 0; i < timestamps.length; i++) {
        data.push({
          time: timestamps[i],
          open: opens[i],
          high: highs[i],
          low: lows[i],
          close: closes[i],
        });
      }
      console.log(data);
      return data;
    };

    const timestamps = [timeStr];
    const opens = [openStr];
    const closes = [closeStr];
    const highs = [highStr];
    const lows = [lowStr];
    const candlestickData = generateCandlestickData(
      timestamps,
      opens,
      closes,
      highs,
      lows
    );
    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(candlestickData);

    // Customize the price scale
    chart.applyOptions({
      priceScale: {
        mode: PriceScaleMode.Normal,
      },
    });
    console.log(timeStr, "timeStr");
    console.log(candlestickData, "----");

    // Function to update the chart's dimensions on window resize
    const handleResize = () => {
      if (chart) {
        chart.resize(containerRef.current.clientWidth, 800); // Adjust the height as needed
      }
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      // Remove the resize event listener when the component unmounts
      window.removeEventListener("resize", handleResize);

      if (chart) {
        chart.remove();
      }
    };
  }, [parsedMessage]);

  return <div className="chart-container" ref={containerRef}></div>;
};

export default CandlestickChart;
