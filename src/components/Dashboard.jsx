import React, { useState, useEffect } from "react";
import { useMonad } from "../context/WebSocketMonad";
import {
  TrendingUp,
  DollarSign,
  ArrowLeftRight,
  Images,
  Cuboid,
  Coins,
  Container,
  HelpCircle,
  Code
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Truck from "../assets/Truck.svg";
import TruckOther from '../assets/truck-other.svg'
import TruckContract from '../assets/truck-contract.svg'
import TruckNft from '../assets/truck-nft.svg'
import TruckTransaction from '../assets/truck-transaction.svg'
import MonadLogo from '../assets/logo-monad.png'

export default function Dashboard() {
  const { stats, latestBlock, transactions } = useMonad();
  const [isHover, setIsHover] = useState(false);
  const [block, setBlock] = useState([]);
  const [prevBlock, setPrevBlock] = useState(null);
  const categoryStats = stats.categoryStats || {}

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num?.toString() || '0'
  }

  // Enhanced stats with dummy data
  const statsData = [
    {
      title: "Block Height",
      value: latestBlock?.number?.toLocaleString() || 0,
      icon: <Cuboid className="stat-icon" />,
    },
    {
      title: "TPS",
      value: stats.blockTransactions || 0,
      icon: <TrendingUp className="stat-icon" />,
    },
    {
      title: "Total Transactions", 
      value: formatNumber(stats.totalTransactions) || "15.6K",
      icon: <DollarSign className="stat-icon" />,
    },
    {
      title: "DeFi Operations",
      value: categoryStats.defi || 0,
      icon: <Coins className="stat-icon" />,
    },
    {
      title: "NFT Operations", 
      value: categoryStats.nft || 0,
      icon: <Images className="stat-icon" />,
    },
    {
      title: "Transfers",
      value: categoryStats.transfer || 0, 
      icon: <ArrowLeftRight className="stat-icon" />,
    },
    {
      title: "Contract Calls",
      value: categoryStats.contractCall || 0,
      icon: <Code className="stat-icon" />,
    },
    {
      title: "Other",
      value: categoryStats.other || 0,
      icon: <HelpCircle className="stat-icon" />,
    }
  ];

  // Generate trucks in different lanes
  const getLanePosition = (laneNumber) => {
    const highway = {
      top: 'calc(50% - 100px)',
      lanes: [
        'calc(50% - 75px)',  // Lane 1 (top)
        'calc(50% - 25px)',  // Lane 2 (middle) 
        'calc(50% + 25px)'   // Lane 3 (bottom)
      ]
    };
    return highway.lanes[laneNumber % 3];
  };

useEffect(() => {
  if (transactions.length === 0) return;
  let isObject = {}
  let isArray = []
  for(let i = 0; i < transactions.length; i++) {
    if(!isObject[transactions[i].blockNumber]) {
      isObject[transactions[i].blockNumber] = transactions[i]
    }
  }

  for(let key in isObject) {
    isArray.push(isObject[key])
  }
  setBlock(isArray)
}, [transactions]);

  return (
    <div className="dashboard-app">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
            <img src={MonadLogo} className="logo" />
          <div>
            {/* <div className="brand-name">
              Monad Testnet */}
              <span className="subtitle">Truck Visualization Monad</span>
            {/* </div> */}
          </div>
        </div>
        <div className="header-right">
          <div className="network-indicator">
            <div className="status-dot"></div>
            <span>Monad Testnet</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="stats-sidebar">
          <h2 className="sidebar-title">Network Statistics</h2>
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-title">{stat.title}</h3>
                  {stat.icon}
                </div>
                <div className="stat-value">
                  {stat.value}
                  {stat.unit && <span className="stat-unit">{stat.unit}</span>}
                </div>
                {stat.change && (
                  <div className="stat-change">{stat.change}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Road Area */}
        <div className="road">
          <div className="highway">
            {block.map((truck) => (
              <div 
                key={truck.blockNumber}
                className="truck"
                style={{
                  top: getLanePosition(truck.lane),
                  animationDelay: `${truck.animation}s`, // boleh kecil
                  position: 'absolute',
                }}
              >
                <img src={truck.dropImage} alt="truck" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
  <div className="footer-left">
    <div className="transaction-types-label">Transaction Types:</div>
    <div className="transaction-types">
      <div className="tx-type">
        <div className="tx-icon-type">
          <div className="tx-icon transfer">
            <img src={Truck} style={{width: '20px', height: '20px'}} />
          </div>
          <span>Transfer</span>
        </div>
      </div>
      <div className="tx-type">
        <div className="tx-icon-type">
          <div className="tx-icon defi">
            <img src={TruckTransaction} style={{width: '20px', height: '20px'}} />
          </div>
          <span>DeFi</span>
        </div>
      </div>
      <div className="tx-type">
        <div className="tx-icon-type">
          <div className="tx-icon contract">
            <img src={TruckContract} style={{width: '20px', height: '20px'}} />
          </div>
          <span>Contract Call</span>
        </div>
      </div>
      <div className="tx-type">
        <div className="tx-icon-type">
          <div className="tx-icon nft">
            <img src={TruckNft} style={{width: '20px', height: '20px'}} />
          </div>
          <span>NFT</span>
        </div>
      </div>
      <div className="tx-type">
        <div className="tx-icon-type">
          <div className="tx-icon other">
            <img src={TruckOther} style={{width: '20px', height: '20px'}} />
          </div>
          <span>Other</span>
        </div>
      </div>
    </div>
  </div>
  <div className="footer-right">
    Built by Shhb for Monad Community
  </div>
</footer>
    </div>
  );
}