import { useState } from 'react'
import { hexlify, parseEther, formatEther, ethers } from 'ethers'

import ENSRegistryABI from './abis/ENSRegistry.json'
import ETHRegistrarControllerABI from './abis/ETHRegistrarController.json'
import BaseRegistrarABI from './abis/BaseRegistrarImplementation.json'
import NameWrapperABI from './abis/NameWrapper.json'
import PublicResolverABI from './abis/PublicResolver.json'

import './App.css'

// Importing User Keys from the ENV File
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY
const walletPrivateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY

// Creating a Wallet, Provider, and Signer
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
const wallet = new ethers.Wallet(walletPrivateKey, provider);
const signer = wallet.connect(provider)

// Contract Addresses on Sepolia https://docs.ens.domains/learn/deployments
const ETHRegistrarControllerAddress = '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968'
const BaseRegistrarAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
const PublicResolverAddress = '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5'

const NameWrapperAddress = '0x0635513f179D50A207757E05759CbD106d7dFcE8'
const ENSRegistryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

// Create Contracts
const publicResolver = new ethers.Contract(
  PublicResolverAddress,
  PublicResolverABI.abi,
  signer // provider
)

const baseRegistrar = new ethers.Contract(
  BaseRegistrarAddress,
  BaseRegistrarABI.abi,
  provider
)

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
  const [resolvedEnsName, setResolvedEnsName] = useState('')
  const [resolvedEnsNameMessage, setResolvedEnsNameMessage] = useState('')

  const [textRecordName, setTextRecordName] = useState('')
  const [textRecordKey, setTextRecordKey] = useState('')
  const [textRecordValue, setTextRecordValue] = useState('')

  function showInformation() {
    // Importing User Keys from the ENV File
    console.log('Alchemy API Key: ', alchemyKey)
    console.log('Wallet Private Key: ', walletPrivateKey)

    // Creating a Wallet
    console.log('Wallet: ', wallet)
    console.log('Wallet Address: ', wallet.address)

    // Creating a Provider and Signer
    console.log('Provider: ', provider)
    console.log('Signer: ', signer)

    // Contracts on Sepolia
    console.log('ETHRegistrarControllerAddress: ', ETHRegistrarControllerAddress)
    console.log('BaseRegistrarAddress: ', BaseRegistrarAddress)
    console.log('PublicResolverAddress: ', PublicResolverAddress)

    // Imported ABIs
    console.log('ETHRegistrarControllerABI: ', ETHRegistrarControllerABI)
    console.log('BaseRegistrarABI: ', BaseRegistrarABI)
    console.log('PublicResolverABI: ', PublicResolverABI)

    // Create a Public Resolver
    console.log('Public Resolver: ', publicResolver)
  }

  // Unit Conversion
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

  // Blockchain
  async function checkBlockNumber() {
    const blockNumber = await provider.getBlockNumber();

    setBlockNumber(blockNumber)

    return blockNumber
  }

  // Wallets
  async function getAccountBalance(account: string) {
    const balance = await provider.getBalance(account)

    setAccountBalance(balance)

    return balance
  }

  // ENS
  function createEnsSepoliaDeployment() {
    if (ensDomainName.includes('.eth')) {
      setEnsDomainNameMessage('This name includes ".eth". which is not necessary. Please remove and try again.')

      return
    }

    setEnsDomainNameMessage('Name is valid. Registering ENS domain name...')

    // Registration Data
    const name = ensDomainName
    const duration = 31536000 // 60 * 60 * 24 * 365
    const secret = hexlify(ethers.randomBytes(32))

    console.log('Name: ', name)
    console.log('Duration: ', duration)
    console.log('Secret: ', secret)

    setEnsDomainNameMessage(`Creating domain name for ${name}.eth...`)

    createName()

    async function createName() {
      const registrationObject = {
        label: name,
        owner: await signer.getAddress(), // Your personal wallet is now the owner
        duration: duration,
        secret: secret,
        resolver: PublicResolverAddress, // '0x0000000000000000000000000000000000000000' = null, meaning no resolver is set
        data: [],
        reverseRecord: 1, // 0 reverse record flag set to 0
        referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }

      console.log('Registration Object: ', registrationObject)

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

      // ENS Domain Name Created Successfully
      console.log(`ENS name "${name}.eth" registered!`)
      setEnsDomainNameMessage(`ENS name "${name}.eth" registered!`)

      console.log(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
      setEnsDomainNameMessage(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)

      // Verify Ownership

      // const baseRegistrar = new ethers.Contract(
      //   BaseRegistrarAddress,
      //   BaseRegistrarABI.abi,
      //   provider
      // )

      // const tokenId = ethers.keccak256(ethers.toUtf8Bytes(name))
      // const owner = await baseRegistrar.ownerOf(tokenId)

      // console.log("Owner of domain:", owner)
    }
  }

  async function allowResolution(ensName: string) {
    const node = ethers.namehash(ensName)
    const yourAddress = await signer.getAddress()

    console.log('Node: ', node)
    console.log('Your Address: ', yourAddress)

    const tx3 = await publicResolver['setAddr'](node, yourAddress)
    await tx3.wait()

    console.log('Address record set.')
    setResolvedEnsNameMessage('Address record set.')

    await provider.resolveName(ensName)

    console.log('Address record set successfully! You should now be able to resolve the name.')
    setResolvedEnsNameMessage('Address record set successfully! You should now be able to resolve the name.')
  }

  async function resolveName(ensName: string) {
    // const namehash = ethers.namehash(ensName)

    // console.log(namehash)
    // console.log('Public Resolver: ', publicResolver)

    // const resolvedAddress = await publicResolver['addr(bytes32)'](namehash)

    // console.log("Resolved address:", resolvedAddress)

    const address = await provider.resolveName(ensName)

    if (address) {
      console.log('Name resolved successfully!')
      setEnsNameAddress(address)

      return address
    } else {
      console.log('Could not resolve name.')
      setEnsNameAddress('Could not resolve name.')

      return null
    }
  }

  async function setTextRecord(ensName: string) {
    console.log('Public Resolver: ', publicResolver)

    const node = ethers.namehash(ensName)

    console.log('node: ', node)
    console.log('Text Record Key: ', textRecordKey)
    console.log('Text Record Value: ', textRecordValue)

    const tx = await publicResolver.setText(node, textRecordKey, textRecordValue);

    await tx.wait();

    console.log(`Set Text Record: ${textRecordKey} = ${textRecordValue}`);

    // Verification
    const stored = await publicResolver.text(node, textRecordKey);

    console.log(`Value for ${textRecordKey}:`, stored);
  }

  async function wrapName() {
    const label = 'richcanvas5.eth'.split('.')[0]

    console.log('Wrapping: ', name)

    const nameWrapper = new ethers.Contract(NameWrapperAddress, NameWrapperABI.abi, wallet);
    const ensRegistry = new ethers.Contract(ENSRegistryAddress, ENSRegistryABI.abi, provider);

    console.log('Name Wrapper: ', nameWrapper)
    console.log('ENS Registry: ', ensRegistry)

    console.log("Label:", label)
    console.log("Wallet Address:", wallet.address)
    console.log("Public Resolver:", publicResolver.target)

    const owner = await baseRegistrar.ownerOf('0x079bff3bb7c5120fb6923a4dedc1d5f133c1dcb705aa65716b8ba0f807209593');
    console.log("Owner: ", owner)

    const signer1 = await provider.getSigner();
    console.log(signer1); // Should match token owner

    const tx = await nameWrapper.wrapETH2LD(label, wallet.address, 0, publicResolver.target);

    console.log("Waiting for transaction to confirm...");
    await tx.wait();

    console.log(`${name} has been wrapped!`);
  }

  return (
    <div className='contentContainer'>
      <h1 className='mainHeader'> Ethereum Playground </h1>

      <h2> User Information </h2>

      {/* User Information */}
      <div className='block user'>
        <p><span className='bold'>Wallet Public Address:</span> {wallet.address} </p>
        <p><span className='bold'>Wallet Private Key:</span> {walletPrivateKey} </p>

        <div>
          <button onClick={() => {showInformation()}}> Show Information in Console </button>
        </div>
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

      {/* Register an ENS Domain Name */}
      <div className='block'>
        <h2> Register an ENS Domain Name </h2>

        <ul>
          <li> Make sure to change your private key in the .env file if the account already has a registered ENS domain. </li>
          <li> Make sure to have enough ETH in your account (&#62; 0.0032 ETH) for gas fees. </li>
          <li> You will have to "allow resolution" below in order to resolve the ENS name. </li>
        </ul>

        <p><span className='bold'>Desired ENS Domain Name:</span></p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <div>
          <button onClick={() => {createEnsSepoliaDeployment()}}> Create ENS Domain Name </button>
        </div>

        <p><span className='bold'>Message:</span> {ensDomainNameMessage} </p>
      </div>

      {/* Allow Resolution for an ENS Domain Name */}
      <div className='block'>
        <h2> Allow Resolution for an ENS Domain Name </h2>

        <p><span className='bold'>ENS Name:</span></p>
        <input type="text" onChange={(e) => setResolvedEnsName(e.target.value)} />

        <div>
          <button onClick={() => {allowResolution(resolvedEnsName)}}> Resolve ENS Name </button>
        </div>

        <p><span className='bold'>Message:</span> {resolvedEnsNameMessage} </p>
      </div>

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

        <p><span className='bold'>Message:</span> {ensNameAddress} </p>
      </div>

      {/* Set Text Record */}
      <div className='block'>
        <h2> Set Text Record </h2>

        <p> Text records are key-value pairs like email, avatar, and url. </p>
        <p> In order to set text records, the account with the private key must be the owner of the ENS domain name. </p>

        <p><span className='bold'>ENS Name:</span></p>
        <input type="text" onChange={(e) => setTextRecordName(e.target.value)} />

        <p><span className='bold'>Key:</span></p>
        <input type="text" onChange={(e) => setTextRecordKey(e.target.value)} />

        <p><span className='bold'>Value:</span></p>
        <input type="text" onChange={(e) => setTextRecordValue(e.target.value)} />

        <div>
          <button onClick={() => {setTextRecord(textRecordName)}}> Set Text Record </button>
        </div>

        <p><span className='bold'>Message:</span> {ensNameAddress} </p>
      </div>

      {/* Wrap Name */}
      <div className='block'>
        <h2> Wrap Name (in progress) </h2>

        <p> Wrapping a name means turning it into an ERC-1155 NFT via the ENS Name Wrapper smart contract, allowing the ENS domain to behave like an NFT. </p>

        <div>
          <button onClick={() => {wrapName()}}> Wrap Name </button>
        </div>

        <p><span className='bold'>Message:</span> {ensNameAddress} </p>
      </div>

      <h2> Features </h2>

      {/* To Add */}
      <div className='block user'>
        <h2> To Add </h2>

        <ul>
          <li> Retrieve Text Records for an ENS Domain </li>
          <li> Update Text Records for an ENS Domain </li>
          <li> Add Subnames / Subdomains for an ENS Domain </li>
          <li> Resolve All Text Records from ENS Domain </li>
          <li> Resolve Address from an SCA ENS Domain </li>
          <li> Manually write and deploy smart contracts using Solidity </li>
          <li> ENS Content Hash? </li>
        </ul>
      </div>
    </div>
  )
}

export default App
