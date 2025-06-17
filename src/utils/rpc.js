import { ethers } from "ethers";

const RPC_URL = "https://testnet-rpc.monad.xyz"; // Replace with your RPC
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * Fetch TPS (Transactions Per Second) for the last N blocks
 */
export const getTPS = async (blockCount = 10) => {
  const latestBlock = await provider.getBlock("latest");
  const blockNumbers = Array.from({ length: blockCount }, (_, i) => latestBlock.number - i);
  
  const blocks = await Promise.all(
    blockNumbers.map(num => provider.getBlock(num))
  );

  console.log('block', latestBlock.number)

  // Calculate average TPS (assuming 1s block time)
  const totalTxs = blocks.reduce((sum, block) => sum + block.transactions.length, 0);
  const tps = totalTxs / blockCount;
  console.log('TPS', tps)
  return {
    tps: tps.toFixed(2),
    block: latestBlock.number
}
};

/**
 * Fetch current gas price in Gwei
 */
export const getGasPrice = async () => {
  const gasPriceWei = await provider.getFeeData().then(data => data.gasPrice);
  console.log('gasPrice', ethers.formatUnits(gasPriceWei, "gwei"))
  return ethers.formatUnits(gasPriceWei, "gwei");
};

/**
 * Get historical gas prices (last N blocks)
 */
export const getHistoricalGasPrices = async (blockCount = 10) => {
  const latestBlock = await provider.getBlock("latest");
  const blockNumbers = Array.from({ length: blockCount }, (_, i) => latestBlock.number - i);
  
  const blocks = await Promise.all(
    blockNumbers.map(num => provider.getBlock(num))
  );

  return blocks.map(block => ({
    timestamp: new Date(block.timestamp * 1000),
    gasPrice: ethers.formatUnits(block.gasPrice, "gwei")
  }));
};