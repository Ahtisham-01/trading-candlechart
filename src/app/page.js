"use client";
import CandlestickChart from "./components/candlestickChart";
import AreaChart from "./components/areaChart";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CandlestickChart_1 from "./components/candleChart_1";
// import useWebSocket from "react-use-websocket";

export default function Home() {
  // const socketUrl = "wss://wspap.okx.com:8443/ws/v5/business?brokerId=9999";

  // const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
  //   onOpen: () => console.log("WebSocket Connected"),
  //   shouldReconnect: (closeEvent) => true,
  //   reconnectAttempts: 10,
  //   reconnectInterval: 3000,
  // });

  // const handleMessage = useCallback(() => {
  //   const message = {
  //     op: "subscribe",
  //     args: [
  //       {
  //         instId: "BTC-USD-SWAP",
  //         channel: "mark-price-candle1m"
  //       },
  //     ],
  //   };
  //   sendMessage(JSON.stringify(message));
  // }, [sendMessage]);

  // useEffect(() => {
  //   handleMessage();
  // }, [handleMessage]);

  // const parsedMessage = lastMessage ? JSON.parse(lastMessage.data) : null;
  // console.log(parsedMessage)
  return (
    <React.Fragment>
      <div className="w-full h-screen  p-8">
        <p className="text-5xl text-center py-4 w-full font-bold">MT TRADING</p>
        <div className="w-full   flex flex-col md:flex-row  gap-5 ">
          <div className="w-full flex flex-col gap-3  shadow-md bg-slate-50 rounded-sm p-5">
            <span className="text-3xl text-black font-bold">Candle chart</span>
            <CandlestickChart
            // parsedMessage={parsedMessage}
            />
          </div>
          <div className="w-full flex flex-col gap-3  shadow-md bg-slate-50 rounded-sm p-5">
            <span className="text-3xl text-black font-bold">
              Series chart chart
            </span>
            <AreaChart
            // parsedMessage={parsedMessage}
            />
          </div>
        </div>
        <div className="w-full p-8">
          <span className="text-3xl text-black font-bold">
            Candle and series chart
          </span>

          <CandlestickChart_1 />
        </div>
      </div>
    </React.Fragment>
  );
}
