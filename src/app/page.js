"use client";
import React from "react";
import CandlestickChart from "./components/candlestickChart";
import AreaChart from "./components/areaChart";
export default function Home() {
  const data = [
    { value: 0, time: 1642425322 },
    { value: 8, time: 1642511722 },
    { value: 10, time: 1642598122 },
    { value: 20, time: 1642684522 },
    { value: 3, time: 1642770922 },
    { value: 43, time: 1642857322 },
    { value: 41, time: 1642943722 },
    { value: 43, time: 1643030122 },
    { value: 56, time: 1643116522 },
    { value: 46, time: 1643202922 },
  ];
  const candlestickData = [
    { time: 1672502400000, open: 100, high: 110, low: 90, close: 105 }, // Green candle (up trade)
    { time: 1672588800000, open: 105, high: 115, low: 100, close: 112 }, // Green candle (up trade)
    { time: 1672675200000, open: 112, high: 120, low: 105, close: 108 }, // Red candle (down trade)
    { time: 1672761600000, open: 108, high: 115, low: 100, close: 104 }, // Red candle (down trade)
    { time: 1672848000000, open: 104, high: 110, low: 95, close: 108 }, // Green candle (up trade)
    { time: 1672934400000, open: 108, high: 115, low: 100, close: 112 }, // Green candle (up trade)
    { time: 1673020800000, open: 112, high: 120, low: 105, close: 108 }, // Red candle (down trade)
    { time: 1673107200000, open: 108, high: 115, low: 100, close: 104 }, // Red candle (down trade)
    { time: 1673193600000, open: 104, high: 110, low: 95, close: 108 }, // Green candle (up trade)
    { time: 1673280000000, open: 108, high: 115, low: 100, close: 112 }, // Green candle (up trade)
    // Add more static candlestick data points as needed
  ];
  return (
    <React.Fragment>
      <div className="w-full h-screen  p-8">
        <p className="text-5xl text-center py-4 w-full font-bold">MT TRADING</p>
        <div className="w-full   flex  gap-5 ">
          <div className="w-full flex flex-col gap-3  shadow-md bg-slate-50 rounded-sm p-5">
          <span className="text-3xl text-black font-bold">Candle chart</span>
          <CandlestickChart candlestickData={candlestickData} />
          </div>
          <div className="w-full flex flex-col gap-3  shadow-md bg-slate-50 rounded-sm p-5">
          <span className="text-3xl text-black font-bold">Area chart</span>
            <AreaChart data={data} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
