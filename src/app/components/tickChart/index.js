// import React, { useEffect, useRef, useState } from "react";
// import {
//   createChart,
//   PriceScaleMode,
//   en,
//   CrosshairMode,
// } from "lightweight-charts";

// const AreaSeriesChart11 = ({ lastMessage }) => {
//   const containerRef = useRef(null);
//   const chartRef = useRef(null);
//   const areaSeriesRef = useRef(null);
//   const [lastData, setLastData] = useState({ time: 0, value: 0 });
//  // Add state to store the previous value for interpolation
// //  const [prevData, setPrevData] = useState({ time: 0, value: 0 });
// const [markers, setMarkers] = useState([]);
//   useEffect(() => {
//     chartRef.current = createChart(containerRef.current, {
//       width: containerRef.current.clientWidth,
//       height: 400,
//       localization: en,
//       timeScale: {
//         timeVisible: true,
//         secondsVisible: false,
//         borderColor: "rgba(197, 203, 206, 0.8)",
//         textColor: "rgba(255, 255, 255, 0.9)",
//       },
//       crosshair: {
//         mode: CrosshairMode.Normal,
//       },
//       layout: {
//         background: "#000000",
//         textColor: "rgba(255, 255, 255, 0.9)",
//       },
//       grid: {
//         vertLines: {
//           color: "rgba(42, 46, 57, 0)",
//         },
//         horzLines: {
//           color: "rgba(42, 46, 57, 0.6)",
//         },
//       },
//       priceScale: {
//         borderColor: "rgba(197, 203, 206, 0.8)",
//       },
//     });
//     areaSeriesRef.current = chartRef.current.addAreaSeries({
//       topColor: "rgba(67, 83, 254, 0.7)",
//       bottomColor: "rgba(67, 83, 254, 0.3)",
//       lineColor: "rgba(67, 83, 254, 1)",
//       lineWidth: 2,
//     });

//     return () => {
//       chartRef.current.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (!lastMessage?.data) return;

//     const data = JSON.parse(lastMessage.data);
//     if (!data || !data.data) return;
// // console.log(data,"lastMessage?.data")
//     const [timeStr, , , , closeStr] = data.data[0];
//     const timeInSeconds = Math.floor(parseInt(timeStr, 10) / 1000); // make sure this is a UNIX timestamp in seconds
//     const value = parseFloat(closeStr);

//     const newPoint = { time: timeInSeconds, value };

//     try {
//       areaSeriesRef.current.update(newPoint);
//       setLastData(newPoint); // Store the new point
//       // chartRef.current.timeScale().scrollToPosition(-1, false);
//     } catch (e) {
//       // console.error("Error updating chart:", e);
//     }
//   }, [lastMessage?.data]);

// // Cosine interpolation function
// // const cosineInterpolate = (y1, y2, mu) => {
// //   const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
// //   return (y1 * (1 - mu2)) + (y2 * mu2);
// // };
// // useEffect(() => {
// //   const updateIntervalMs = 50; // Update the chart every 50 milliseconds
// //   let lastUpdateTime = Date.now();

// //   const interval = setInterval(() => {
// //     const now = Date.now();

// //     if (lastData.time !== 0) {
// //       // Calculate elapsed time since the last update
// //       const elapsedTime = now - lastUpdateTime;
// //       lastUpdateTime = now;

// //       // Calculate mu for interpolation (0 <= mu <= 1)
// //       const mu = elapsedTime / updateIntervalMs;

// //       // Interpolate the new value using cosine interpolation
// //       const interpolatedValue = cosineInterpolate(
// //         prevData.value, // one-step previous value
// //         lastData.value, // current value
// //         mu
// //       );

// //       const newValue = {
// //         time: Math.floor(now / 1000), // Convert timestamp to seconds
// //         value: interpolatedValue
// //       };

// //       areaSeriesRef.current.update(newValue);
// //       // Update the previous value with the last known data point before updating the lastData
// //       setPrevData(lastData);
// //       setLastData(newValue); // Update the last known data point
// //     }
// //   }, updateIntervalMs);

// //   return () => clearInterval(interval);
// // }, [lastData]);

//   useEffect(() => {
//     const updateIntervalMs = 50; // Update the chart every 50 milliseconds
//     let lastUpdateTime = Date.now();
//     // If lastData is not null, start an interval to update the chart
//     const interval = setInterval(() => {
//       const now = Date.now();
//       if (lastData.time !== 0) {
//         // Calculate elapsed time since the last update
//         const elapsedTime = now - lastUpdateTime;
//         lastUpdateTime = now;

//         // Interpolate the new value
//         const newValue = {
//           time: Math.floor(now / 1000), // Convert timestamp to seconds
//           value:
//             lastData.value + (elapsedTime / 1000) * (Math.random() - 0.5) * 0.1, // Random walk for demonstration
//         };
//         setMarkers([
//           {
//             time: newValue.time,
//             position: 'inBar', // or 'belowBar', depending on where you want it
//             color: 'blue',
//             shape: 'circle',
//             id: 'marker-id', // Optional unique identifier for the marker
//           },
//         ]);
//         // console.log(newValue.value, "newValue", lastData.value);
//         areaSeriesRef.current.update(newValue);
//       areaSeriesRef.current.setMarkers(markers);

//         setLastData(newValue); // Update the last known data point
//       }
//     }, updateIntervalMs);
   
//     return () => clearInterval(interval);
//   }, [lastData ,markers]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (chartRef.current) {
//         chartRef.current.resize(containerRef.current.clientWidth, 400);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return <div className="chart-container" ref={containerRef}></div>;
// };

// export default AreaSeriesChart11;


import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  PriceScaleMode,
  en,
  CrosshairMode,
} from "lightweight-charts";

const AreaSeriesChart11 = ({ lastMessage }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);
  const [lastData, setLastData] = useState(null)
 // Add state to store the previous value for interpolation
//  const [prevData, setPrevData] = useState({ time: 0, value: 0 });
const [markers, setMarkers] = useState([]);
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
      topColor: "rgba(67, 83, 254, 0.7)",
      bottomColor: "rgba(67, 83, 254, 0.3)",
      lineColor: "rgba(67, 83, 254, 1)",
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

    const [timeStr, , , , closeStr] = data.data[0];
    const time = Math.floor(new Date(timeStr).getTime() / 1000);
    const value = parseFloat(closeStr);

    const newPoint = { time: time, value: value };


    try {
      areaSeriesRef.current.update(newPoint);

      setLastData(newPoint);
            chartRef.current.timeScale().scrollToPosition(10, false);
          } catch (e) {
            // console.error("Error updating chart:", e);
          }

        // Update markers here
        setMarkers([{ 
          time: time,
          position: 'aboveBar',
          color: 'blue',
          shape: 'circle',
          id: `marker-${time}`,
        }]);
  }, [lastMessage?.data]);

  useEffect(() => {
    if (!lastData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const time = Math.floor(now / 1000);

      // Random walk for the value to simulate live changes
      const randomWalk = lastData.value + (Math.random() - 0.5) * 0.1;
      const newValue = { time: time, value: randomWalk };
try{
  areaSeriesRef.current.update(newValue);
  setLastData(newValue);

}catch (e){
console.log("pakra gya")
}
      setMarkers([{ 
        time: time,
        position: 'inBar',
        color: 'blue',
        shape: 'circle',
        id: `marker-${time}`,
      }]);
    }, ); // This sets the update frequency to 1 millisecond
  
    return () => clearInterval(interval);
    
  }, [lastData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(containerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    // Apply markers to the chart
    if (areaSeriesRef.current && markers.length > 0) {
      areaSeriesRef.current.setMarkers(markers);
    }
  }, [markers]);
  return <div className="chart-container" ref={containerRef}></div>;
};

export default AreaSeriesChart11;
