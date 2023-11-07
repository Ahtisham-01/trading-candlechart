"use client"
import CandlestickChart from "./components/candlestickChart";
import AreaChart from "./components/areaChart";
import React, {  useEffect,  useState } from "react";
import CandlestickChart_1 from "./components/candleChart_1";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ToggleTabs from "./components/ToggleTabs";
const tabArray = [
  {
    id: 0,
    title: "Candlestick Chart",
  },
  {
    id: 1,
    title: "Area Chart",
  },
  {
    id: 2,
    title: "Both candle & area chart ",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const socketUrl = "wss://wspap.okx.com:8443/ws/v5/business?brokerId=9999";
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(
        JSON.stringify({
          op: "subscribe",
          args: [{ instId: "BTC-USD-SWAP", channel: "mark-price-candle1m" }],
        })
      );
    }
  }, [readyState, sendMessage]);
  const parsedMessage = lastMessage ? JSON.parse(lastMessage.data) : null;
  function renderingTheSteps(step) {
    switch (step) {
      case 0:
        return (
          <div className="w-full flex flex-col gap-3  shadow-md border border-zinc-700 bg-black rounded-md p-5">
            <span className="text-3xl text-white font-bold">Candle chart</span>
            <CandlestickChart lastMessage={lastMessage} />
          </div>
        );
      case 1:
        return (
          <div className="w-full flex flex-col gap-3  shadow-md border border-zinc-700 bg-black rounded-md p-5">
            <span className="text-3xl text-white font-bold">
              Series chart chart
            </span>
            <AreaChart lastMessage={lastMessage} />
          </div>
        );
      case 2:
        return (
          <div className="w-full flex flex-col gap-3  shadow-md border border-zinc-700 bg-black rounded-md p-5">
            <span className="text-3xl text-white font-bold">
              Series chart chart
            </span>
            <CandlestickChart_1 lastMessage={lastMessage} />
          </div>
        );
    }
  }
  return (
    <React.Fragment>
      <div className="w-full h-screen  p-8">
        <div className="flex justify-between  rounded-lg shadow  border-zinc-700 border bg-black items-center w-full container mx-auto">
          <div className="flex gap-2 w-full items-center">
            <img
              src="/app-mobile-logo.png"
              alt="btc logo"
              className=" w-24 h-24 rounded-full"
            />
            <p className="text-5xl text-center py-4  text-white font-bold">
              MT TRADING
            </p>
          </div>
          <div className="relative m-8  bg-black rounded-lg shadow w-62 w-full ">
            <img
              src="https://img.clankapp.com/symbol/btc.svg"
              alt="btc logo"
              className="absolute w-24 h-24 rounded-full opacity-50 -top-6 -right-6 md:-right-4"
            />
            <div className="px-4 py-5 sm:p-6 border border-zinc-700 bg-black rounded-md">
              <dl>
                <div className="flex gap-4">
                  <div className="text-sm font-medium leading-5 text-green-500 truncate">
                    {parsedMessage?.data != undefined &&
                      `High: ${parsedMessage?.data[0][2]}`}
                  </div>
                </div>
                <div className="mt-1 text-3xl font-semibold leading-9 text-gray-400">
                  ${" "}
                  {parsedMessage?.data != undefined &&
                    parsedMessage?.data[0][4]}
                </div>
                <div className="font-semibold text-white">
                  <div className="text-sm font-medium leading-5 text-red-500 truncate">
                    {parsedMessage?.data != undefined &&
                      `low: ${parsedMessage?.data[0][3]}`}
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-auto gap-2 pb-8 container">
          <ToggleTabs
            tabArray={tabArray}
            // renderTabContent={renderTabContent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {renderingTheSteps(activeTab)}
          </ToggleTabs>
        </div>
      </div>
    </React.Fragment>
  );
}
