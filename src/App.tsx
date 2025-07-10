import { useState } from 'react'
import { hexlify, parseEther, formatEther, ethers } from 'ethers'
import './App.css'

import ETHRegistrarControllerABI from './abis/ETHRegistrarController.json'
import BaseRegistrarABI from './abis/BaseRegistrarImplementation.json'
import PublicResolverABI from './abis/PublicResolver.json'

// User Information
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

function App() {
  // Converting ETH and Wei
  const [ethNum, setEthNum] = useState('')
  const [parsedEth, setParsedEth] = useState(0n)
  const [weiNum, setWeiNum] = useState('')
  const [parsedWei, setParsedWei] = useState('0')

  // Blockchain Information
  const [blockNumber, setBlockNumber] = useState(0)

  // Wallet Information
  const [address, setAddress] = useState('')
  const [accountBalance, setAccountBalance] = useState(0n)

  // ENS Information
  const [ensName, setEnsName] = useState('')
  const [ensNameAddress, setEnsNameAddress] = useState('')
  const [ensDomainName, setEnsDomainName] = useState('')
  const [ensDomainNameMessage, setEnsDomainNameMessage] = useState('')

  function parseEth(num: string) {
    const number = num.toString()
    const parsedEthNum = parseEther(number)

    setParsedEth(parsedEthNum)

    return parsedEthNum
  }

  function formatWei(num: string) {
    const number = num.toString()
    const parsedWeiNum = formatEther(number)

    setParsedWei(parsedWeiNum)

    return parsedWeiNum
  }

  async function checkBlockNumber() {
    const blockNumber = await provider.getBlockNumber();

    setBlockNumber(blockNumber)

    return blockNumber
  }

  async function getAccountBalance(account: string) {
    const balance = await provider.getBalance(account)

    setAccountBalance(balance)

    return balance
  }

  async function resolveName(ensName: string) {
    const address = await provider.resolveName(ensName)

    setEnsNameAddress(address)

    return address
  }

  function createEnsSepoliaDeployment() {
    setEnsDomainNameMessage(`Registering ENS domain name...`)

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
    const name = ensDomainName
    const duration = 60 * 60 * 24 * 365 // 31_536_000
    const secret = hexlify(ethers.randomBytes(32))

    console.log('Name: ', name)
    console.log('Duration: ', duration)
    console.log('Secret: ', secret)

    setEnsDomainNameMessage(`Creating domain name for ${name}.eth...`)

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
      setEnsDomainNameMessage('Sending commit...')

      const tx1 = await controller.commit(commitment)
      await tx1.wait()

      console.log('Commit sent. Waiting 60 seconds...')
      setEnsDomainNameMessage('Commit sent. Waiting 60 seconds...')

      await new Promise ((r) => setTimeout(r, 60000))

      console.log('Waited 60 seconds!')
      setEnsDomainNameMessage('Waited 60 seconds!')

      console.log('Registering...')
      setEnsDomainNameMessage('Registering...')

      const tx2 = await controller.register(registrationObject, {
        value: BigInt('3125000000003490') // 0.003125 ETH
      })

      await tx2.wait()

      console.log(`ENS name "${name}.eth" registered!`)
      setEnsDomainNameMessage(`ENS name "${name}.eth" registered!`)

      console.log(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
      setEnsDomainNameMessage(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
    }
  }

  return (
    <div className='contentContainer'>
      <h1 className='mainHeader'> Ethereum Playground </h1>

      <h2> User Information </h2>

      {/* User Information */}
      <div className='block user'>
        <p><span className='bold'>Wallet Public Address:</span> {wallet.address} </p>
      </div>

      <h2> Unit Conversion </h2>

      {/* Convert ETH to Wei */}
      <div className='block'>
        <h2> Convert ETH to Wei </h2>

        <p><span className='bold'>ETH:</span></p>
        <input type="number" onChange={(e) => setEthNum(e.target.value)} />

        <div>
          <button onClick={() => {parseEth(ethNum)}}> Convert {ethNum} ETH to Wei </button>
        </div>

        <p><span className='bold'>Converted ETH:</span> {parsedEth} wei </p>
      </div>

      {/* Convert Wei to ETH */}
      <div className='block'>
        <h2> Convert Wei to ETH </h2>

        <p><span className='bold'>Wei:</span></p>
        <input type="number" onChange={(e) => setWeiNum(e.target.value)} />

        <div>
          <button onClick={() => {formatWei(weiNum)}}> Convert {weiNum} Wei to ETH </button>
        </div>

        <p><span className='bold'>Converted Wei:</span> {parsedWei} ETH </p>
      </div>

      <h2> Blockchain </h2>

      {/* Get Current Block Number */}
      <div className='block'>
        <h2> Get Current Block Number </h2>

        <div>
          <button onClick={() => {checkBlockNumber()}}> Check Current Block # </button>
        </div>

        <p><span className='bold'>Current Block Number on Sepolia:</span> {blockNumber} </p>
      </div>

      <h2> Wallets </h2>

      {/* Get Current Account Balance */}
      <div className='block'>
        <h2> Get Current Account Balance </h2>

        <ul>
          <li> You can use a public Hex address (0x...) or an ENS domain. </li>
          <li> Try it with <i>vitalik.eth</i> or <i>0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045</i>. </li>
        </ul>

        <p><span className='bold'>Account Address:</span></p>
        <input type="text" onChange={(e) => setAddress(e.target.value)} />

        <div>
          <button onClick={() => {getAccountBalance(address)}}> Get Account Balance </button>
        </div>

        <p><span className='bold'>Account Address on Sepolia:</span> {address} </p>
        <p><span className='bold'>Account Balance on Sepolia:</span> {accountBalance} wei </p>
      </div>

      <h2> ENS </h2>

      {/* Resolve an ENS Name */}
      <div className='block'>
        <h2> Resolve an ENS Name </h2>

        <p> Resolving an ENS name means to load information about an ENS name, like it's address. </p>

        <ul>
          <li> Try it with <i>vitalik.eth</i>. </li>
        </ul>

        <p><span className='bold'>ENS Name to Resolve:</span></p>
        <input type="text" onChange={(e) => setEnsName(e.target.value)} />

        <div>
          <button onClick={() => {resolveName(ensName)}}> Resolve ENS Name </button>
        </div>

        <p><span className='bold'>ENS Name Address on Sepolia:</span> {ensNameAddress} </p>
      </div>

      {/* Register an ENS Domain Name */}
      <div className='block'>
        <h2> Register an ENS Domain Name </h2>

        <ul>
          <li> Make sure to change your private key in the .env file if the account already has a registered ENS domain. </li>
          <li> Make sure to have enough ETH in your account (&#62; 0.0032 ETH) for gas fees. </li>
        </ul>

        <p><span className='bold'>Desired ENS Name:</span></p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <div>
          <button onClick={() => {createEnsSepoliaDeployment()}}> Create ENS Domain Name </button>
        </div>

        <p><span className='bold'>Message:</span> {ensDomainNameMessage} </p>
      </div>
    </div>
  )
}

export default App
