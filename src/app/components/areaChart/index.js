import React, { useEffect, useRef } from 'react';
import { createChart, UTCTimestamp, PriceScaleMode, en } from 'lightweight-charts';

const AreaChart = ({data}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let chart = null;
    let areaSeries = null;

    chart = createChart(containerRef.current, {
      width: 1200,
      height: 800,
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
      localization: en,
    });

    areaSeries = chart.addAreaSeries({
      lineColor: '#2962FF',
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });

    const areaData = data.map((item) => ({
      time: item.time, // Use timestamps in milliseconds
      value: item.value,
    }));

    areaSeries.setData(areaData);

    chart.timeScale().fitContent();

    return () => {
      if (chart) {
        chart.remove();
      }
    };
  }, [data]);

  return <div ref={containerRef}></div>;
};

export default AreaChart;
