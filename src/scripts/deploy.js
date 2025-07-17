import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY;
  const walletPrivateKey = process.env.VITE_WALLET_PRIVATE_KEY;

  console.log('Alchemy Key: ', alchemyKey);
  console.log('Wallet Private Key: ', walletPrivateKey);

  console.log('We are running the deploy script...');

  const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`);
  const wallet = new ethers.Wallet(walletPrivateKey, provider);

  console.log('Provider: ', provider);
  console.log('Wallet: ', wallet);

  const contractArtifact = JSON.parse(fs.readFileSync('src/contracts/SimpleStorage.json'));
  const contractFactory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.data.bytecode,
    wallet
  );

  console.log('Deploying contract...');

  const contract = await contractFactory.deploy('Hello from EthersJS!'); // 'Hello from EthersJS!' for HelloWorld.json

  await contract.waitForDeployment();

  console.log('Contract deployed at: ', await contract.getAddress());
}

main();