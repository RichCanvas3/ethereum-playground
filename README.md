# Ethereum Playground

A playground to experiment with all things Ethereum.

## Definitions

**Ethereum** - A decentralized blockchain with smart contract functionality.

**Smart Contract** - A program that runs on the Ethereum blockchain. It's a collection of code and data that lives at a specific address on the Ethereum blockchain. The program executes when certain conditions are met, removing the need for a middleman.

## Links

### Layer-1 Ethereum

- [Ethereum](https://ethereum.org/en/)
  - [Ethereum Docs](https://ethereum.org/en/developers/docs/)

### Layer-2 Scaling Solutions

- [Linea.Build](https://linea.build/)

### Ethereum Libraries

- [EthersJS v6](https://docs.ethers.org/v6/)
- [Viem](https://viem.sh/)
- [Pimlico](https://www.pimlico.io/)
  - [Pimlico Docs](https://docs.pimlico.io/)
- [Durin.Dev](https://durin.dev/)

### Ethereum Name Service (ENS)

- [ENS](https://app.ens.domains/)
  - [ENS Docs](https://ens.domains/developers)
  - [ENS Deployments](https://docs.ens.domains/learn/deployments/)
- [ENS Sepolia](https://sepolia.app.ens.domains/)
- [ENSv2](https://ens.domains/ensv2)

### Wallets

- [MetaMask](https://metamask.io/)
  - [MetaMask Software Development Kit (SDK)](https://metamask.io/developer/sdk)
  - [MetaMask Delegation Toolkit (DTK)](https://metamask.io/developer/delegation-toolkit)
  - [MetaMask Snapshots (Snaps)](https://metamask.io/developer/snaps)

### Faucets

- [Google Ethereum Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Circle USDC Faucet](https://faucet.circle.com/)

### Languages

- [Solidity](https://soliditylang.org/)

## Local Setup

1. Clone the Repo

```
git clone git@github.com:RichCanvas3/ethereum-playground.git
cd ethereum-playground
```

2. Create Environment Variables

```
touch .env
```
Required Environment Variables

```
VITE_ALCHEMY_API_KEY=...
VITE_WALLET_PRIVATE_KEY=...
```

3. Install Dependencies

```
npm install
```

4. Build and Run the Application

```
open http://localhost:5173/

npm run build
npm run dev
```