import React, { useState, useEffect } from "react";
import { useMonad } from "../context/WebSocketMonad";
import {
  TrendingUp,
  Zap,
  ArrowUpDown,
  Wallet,
  RefreshCw,
  BarChart3,
  Coins,
  DollarSign,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Truck from "../assets/Truck.svg";

export default function Dashboard() {
  const { stats, latestBlock, transactions } = useMonad();
  const [networkStatus, setNetworkStatus] = useState("🟢 Monad Testnet Live");
  const [isHover, setIsHover] = useState(false);
  const [block, setBlock] = useState([])
  const [prevBlock, setPrevBlock] = useState(null);
  const [latestTransaction, setLatestTransaction] = useState([]);

    const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const statsData = [
    {
      title: "Block Height",
      value: latestBlock && latestBlock.number?.toLocaleString(),
      icon: <TrendingUp className="icon purple" />,
      bg: "purple",
    },
    {
      title: "Transaction Speed",
      value: `${stats.blockTransactions || 0}`,
      unit: "TPS",
      icon: <Zap className="icon purple" />,
      bg: "purple",
    },
    {
      title: "Total Transactions",
      value: formatNumber(stats.totalTransactions),
      icon: <ArrowUpDown className="icon purple" />,
      bg: "purple",
    },
    {
      title: "Gas Fee",
      value: stats.gasPrice,
      unit: "Gwei",
      icon: <BarChart3 className="icon purple" />,
      bg: "purple",
    },
  ];

 useEffect(() => {
  if (!latestBlock?.number) return;

  const currentBlock = Number(latestBlock.number);

  if (prevBlock !== null && currentBlock !== prevBlock) {
    const randomBottom = Math.floor(Math.random() * 100);
    setBlock((prev) => {
      const now = Date.now();
      const maxAgeMs = 5000;
      const maxTrucks = 5;

      const newTruck = {
        id: uuidv4(),
        blockNumber: currentBlock,
        bottom: randomBottom,
        timestamp: now,
      };

      const updated = [...prev, newTruck];

      // Filter truck lama & batasi jumlah maksimal
      return updated
        .filter((t) => now - t.timestamp <= maxAgeMs)
        .slice(-maxTrucks);
    });
  }

  setPrevBlock(currentBlock);
}, [latestBlock]);


  return (
    <div className="dashboard-app">
      <div className="network-status">{networkStatus}</div>

      <header className="dashboard-header">
        <h1 className="dashboard-title">Monad Testnet Explorer</h1>
        <p className="dashboard-subtitle">
          Watch blocks being delivered by our trusty transaction trucks!
        </p>
      </header>

      <div className="dashboard-container">
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.bg}`}>
              <div className="stat-header">
                <div className="stat-title-container">
                  <div className="status-dot"></div>
                  <h3 className="stat-title">{stat.title}</h3>
                </div>
                <div className="icon-container">{stat.icon}</div>
              </div>

              <div className="stat-content">
                <div className="stat-value-container">
                  <span className={`stat-value ${stat.bg}`}>{stat.value}</span>
                  {stat.unit && <span className="stat-unit">{stat.unit}</span>}
                </div>

                {stat.hasProgressBar && (
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                )}

                {stat.subtitle && (
                  <p className="stat-subtitle">{stat.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="road">
          {block.map((truck, i) => (
          <div className="truck" 
              onMouseEnter={() => setIsHover(truck.id)}
              onMouseLeave={() => setIsHover(null)}
              key={truck.id}
              style={{bottom: `${truck.bottom}px`}}
            >
            <img
              src={Truck}
              alt="truck"
              height={120}
            />
            {isHover === truck.id && 
            <div>Tralala</div>
            }
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
