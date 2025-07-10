import { useState } from 'react'
import { hexlify, parseEther, ethers } from 'ethers'
import './App.css'

import ETHRegistrarControllerABI from './abis/ETHRegistrarController.json'
import BaseRegistrarABI from './abis/BaseRegistrarImplementation.json'
import PublicResolverABI from './abis/PublicResolver.json'

function App() {
  const [ethNum, setEthNum] = useState('')
  const [parsedEth, setParsedEth] = useState(0n)
  const [blockNumber, setBlockNumber] = useState(0)
  const [address, setAddress] = useState('')
  const [accountBalance, setAccountBalance] = useState(0n)

  const [ensName, setEnsName] = useState('')
  const [ensNameAddress, setEnsNameAddress] = useState('')
  const [ensDomainName, setEnsDomainName] = useState('')

  const [ensDomainNameSmartContract, setEnsDomainNameSmartContract] = useState('')

  // const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY
  // const walletPrivateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY

  // console.log('Alchemy API Key: ', alchemyKey)
  // console.log('Wallet Private Key: ', walletPrivateKey)

  // const wallet = new ethers.Wallet(walletPrivateKey);

  // console.log('Wallet: ', wallet)
  // console.log('Wallet Address: ', wallet.address)

  // const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
  // const signer = wallet.connect(provider)

  // console.log('Provider: ', provider)
  // console.log('Signer: ', signer)

  // // Contracts on Sepolia
  // const ETHRegistrarControllerAddress = '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968'
  // const BaseRegistrarAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
  // const PublicResolverAddress = '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5'

  // console.log('ETHRegistrarControllerAddress: ', ETHRegistrarControllerAddress)
  // console.log('BaseRegistrarAddress: ', BaseRegistrarAddress)
  // console.log('PublicResolverAddress: ', PublicResolverAddress)

  // // ABIs (Imported Up Top)
  // console.log('ETHRegistrarControllerABI: ', ETHRegistrarControllerABI)
  // console.log('BaseRegistrarABI: ', BaseRegistrarABI)
  // console.log('PublicResolverABI: ', PublicResolverABI)

  // // Registration Data
  // const name = 'grantdavis303'
  // const duration = 60 * 60 * 24 * 365 // 31_536_000
  // const secret = hexlify(ethers.randomBytes(32))

  // console.log('Name: ', name)
  // console.log('Duration: ', duration)
  // console.log('Secret: ', secret)

  // async function createName() {
  //   const registrationObject = {
  //     label: name,
  //     owner: ETHRegistrarControllerAddress,
  //     duration: duration,
  //     secret: secret,
  //     resolver: '0x0000000000000000000000000000000000000000',
  //     data: [],
  //     reverseRecord: 0,
  //     referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
  //   }

  //   const controller = new ethers.Contract(
  //     ETHRegistrarControllerAddress,
  //     ETHRegistrarControllerABI.abi,
  //     signer
  //   )

  //   console.log('Controller: ', controller)

  //   const commitment = await controller.makeCommitment(registrationObject)

  //   console.log('Commitment: ', commitment)

  //   console.log('Sending commit...')

  //   const tx1 = await controller.commit(commitment)
  //   await tx1.wait()

  //   console.log('Commit sent. Waiting 60 seconds...')

  //   await new Promise ((r) => setTimeout(r, 60000))

  //   console.log('Waited 60 seconds!')
  //   console.log('Registering...!')

  //   const tx2 = await controller.register(registrationObject, {
  //     value: BigInt('3125000000003490')
  //   })

  //   // const tx2 = await controller.register(name, wallet.address, duration, secret, {
  //   //   value: await controller.rentPrice(name, duration)
  //   // })

  //   await tx2.wait()

  //   console.log(`ENS name "${name}.eth" registered!`)
  // }

  function parseEth(num: string) {
    const number = num.toString()
    const parsedEthNum = parseEther(number)

    setParsedEth(parsedEthNum)

    return parsedEthNum
  }

  async function checkBlockNumber() {
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
    const blockNumber = await provider.getBlockNumber();

    setBlockNumber(blockNumber)

    return blockNumber
  }

  async function getAccountBalance(account: string) {
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
    const balance = await provider.getBalance(account)

    console.log('Account: ', account)
    console.log('Account Type: ', typeof account)

    setAccountBalance(balance)

    return balance
  }

  async function resolveName(ensName: string) {
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
    const address = await provider.resolveName(ensName)

    console.log('ENS Name: ', ensName)
    console.log('Address: ', address)

    setEnsNameAddress(address)

    return address
  }

  function createEnsSepoliaDeployment() {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY
    const walletPrivateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY

    console.log('Alchemy API Key: ', alchemyKey)
    console.log('Wallet Private Key: ', walletPrivateKey)

    const wallet = new ethers.Wallet(walletPrivateKey);

    console.log('Wallet: ', wallet)
    console.log('Wallet Address: ', wallet.address)

    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
    const signer = wallet.connect(provider)

    console.log('Provider: ', provider)
    console.log('Signer: ', signer)

    // Contracts on Sepolia
    const ETHRegistrarControllerAddress = '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968'
    const BaseRegistrarAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
    const PublicResolverAddress = '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5'

    console.log('ETHRegistrarControllerAddress: ', ETHRegistrarControllerAddress)
    console.log('BaseRegistrarAddress: ', BaseRegistrarAddress)
    console.log('PublicResolverAddress: ', PublicResolverAddress)

    // ABIs (Imported Up Top)
    console.log('ETHRegistrarControllerABI: ', ETHRegistrarControllerABI)
    console.log('BaseRegistrarABI: ', BaseRegistrarABI)
    console.log('PublicResolverABI: ', PublicResolverABI)

    // Registration Data
    const name = ensDomainName // 'grantdavis303'
    const duration = 60 * 60 * 24 * 365 // 31_536_000
    const secret = hexlify(ethers.randomBytes(32))

    console.log('Name: ', name)
    console.log('Duration: ', duration)
    console.log('Secret: ', secret)

    createName()

    async function createName() {
      const registrationObject = {
        label: name,
        owner: ETHRegistrarControllerAddress,
        duration: duration,
        secret: secret,
        resolver: '0x0000000000000000000000000000000000000000',
        data: [],
        reverseRecord: 0,
        referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }

      const controller = new ethers.Contract(
        ETHRegistrarControllerAddress,
        ETHRegistrarControllerABI.abi,
        signer
      )

      console.log('Controller: ', controller)

      const commitment = await controller.makeCommitment(registrationObject)

      console.log('Commitment: ', commitment)

      console.log('Sending commit...')

      const tx1 = await controller.commit(commitment)
      await tx1.wait()

      console.log('Commit sent. Waiting 60 seconds...')

      await new Promise ((r) => setTimeout(r, 60000))

      console.log('Waited 60 seconds!')
      console.log('Registering...!')

      const tx2 = await controller.register(registrationObject, {
        value: BigInt('3125000000003490') // 0.003125 ETH
      })

      // const tx2 = await controller.register(name, wallet.address, duration, secret, {
      //   value: await controller.rentPrice(name, duration)
      // })

      await tx2.wait()

      console.log(`ENS name "${name}.eth" registered!`)
    }
  }

  function createEnsSepoliaDeploymentSmartContract() {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY
    const walletPrivateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY

    console.log('Alchemy API Key: ', alchemyKey)
    console.log('Wallet Private Key: ', walletPrivateKey)

    const wallet = new ethers.Wallet(walletPrivateKey);

    console.log('Wallet: ', wallet)
    console.log('Wallet Address: ', wallet.address)

    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
    const signer = wallet.connect(provider)

    // Registration Data
    const name = ensDomainNameSmartContract
    const contractAddress = '0x'

    console.log('Name: ', name)
  }

  return (
    <>
      <h1> Ethereum Playground </h1>

      <div className='block'>
        <h2> Parsing Ether </h2>

        <input type="number" onChange={(e) => setEthNum(e.target.value)} />

        <div>
          <button onClick={() => {parseEth(ethNum)}}> Parse {ethNum} Eth </button>
        </div>

        <p> Minimum: 0.000000000000000001 </p>
        <p> Parsed Eth: {parsedEth} wei </p>
      </div>

      <div className='block'>
        <h2> Getting Current Block Number </h2>

        <div>
          <button onClick={() => {checkBlockNumber()}}> Check Current Block # </button>
        </div>

        <p> Block # (Sepolia): {blockNumber} </p>
      </div>

      <div className='block'>
        <h2> Getting Account Balance </h2>

        <p> You can use a public Hex address (0x...) or an ENS domain. </p>

        <input type="text" onChange={(e) => setAddress(e.target.value)} />

        <div>
          <button onClick={() => {getAccountBalance(address)}}> Get Account Balance </button>
        </div>

        <p> Account Address (Sepolia): {address} </p>
        <p> Account Balance (Sepolia): {accountBalance} wei </p>
      </div>

      <div className='block'>
        <h2> Resolve ENS Name </h2>

        <p> Try it with <i>vitalik.eth</i> </p>

        <input type="text" onChange={(e) => setEnsName(e.target.value)} />

        <div>
          <button onClick={() => {resolveName(ensName)}}> Resolve ENS Name </button>
        </div>

        <p> ENS Name Address (Sepolia): {ensNameAddress} </p>
      </div>

      <div className='block'>
        <h2> ENS Sepolia Deployment </h2>

        <p> Desired ENS Name: </p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <p> Be sure to change your private key in the .env file </p>
        <p> Be sure to have enough ETH in your account </p>

        <div>
          <button onClick={() => {createEnsSepoliaDeployment()}}> Create ENS Domain Name </button>
        </div>

        <p> Message: {} </p>
      </div>

      <div className='block'>
        <h2> ENS Sepolia Deployment for Smart Contracts </h2>

        <p> Desired ENS Name: </p>
        <input type="text" onChange={(e) => setEnsDomainNameSmartContract(e.target.value)} />

        <p> Be sure to change your private key in the .env file </p>
        <p> Be sure to have enough ETH in your account </p>

        <div>
          <button onClick={() => {createEnsSepoliaDeploymentSmartContract()}}> Create ENS Domain Name (Smart Contract) </button>
        </div>

        <p> Message: {} </p>
      </div>
    </>
  )
}

export default App
