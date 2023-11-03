import React, { useEffect, useRef } from 'react';
import { createChart, UTCTimestamp, PriceScaleMode, en } from 'lightweight-charts';

const AreaChart = ({ data }) => {
  const containerRef = useRef(null);
  let chart = null;

  useEffect(() => {
    chart = createChart(containerRef.current, {
    //   width: '100%',
      height: 800,
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
      localization: en,
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#2962FF',
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });

    const areaData = data.map((item) => ({
      time: item.time, // Use timestamps in milliseconds
      value: item.value,
    }));

    areaSeries.setData(areaData);

    // Function to update the chart's dimensions on window resize
    const handleResize = () => {
      if (chart) {
        chart.resize(containerRef.current.clientWidth, 800); // Adjust the height as needed
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Fit the chart to the container
    chart.timeScale().fitContent();

    return () => {
      // Remove the resize event listener when the component unmounts
      window.removeEventListener('resize', handleResize);

      if (chart) {
        chart.remove();
      }
    };
  }, [data]);

  return <div className='chart-container' ref={containerRef}></div>;
};

export default AreaChart;
