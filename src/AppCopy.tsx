import { useState } from 'react'
import { hexlify, parseEther, formatEther, ethers, keccak256, toUtf8Bytes, namehash } from 'ethers'

import ENSRegistryABI from './abis/ENSRegistry.json'
import BaseRegistrarABI from './abis/BaseRegistrarImplementation.json'
import ETHRegistrarControllerABI from './abis/ETHRegistrarController.json'
import DNSRegistrarABI from './abis/DNSRegistrar.json'
import ReverseRegistrarABI from './abis/ReverseRegistrar.json'
import NameWrapperABI from './abis/NameWrapper.json'
import PublicResolverABI from './abis/PublicResolver.json'
import UniversalResolverABI from './abis/UniversalResolver.json'

import TestContractABI from './contracts/HelloWorld.json'

import './App.css'

const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY
const walletPrivateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
const wallet = new ethers.Wallet(walletPrivateKey, provider);
const signer = wallet.connect(provider)
const signerAddress = await signer.getAddress()

// Contract Addresses (Sepolia: https://docs.ens.domains/learn/deployments)
const ENSRegistryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
const BaseRegistrarAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
const ETHRegistrarControllerAddress = '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968'
const DNSRegistrarAddress = '0x5a07C75Ae469Bf3ee2657B588e8E6ABAC6741b4f'
const ReverseRegistrarAddress = '0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6'
const NameWrapperAddress = '0x0635513f179D50A207757E05759CbD106d7dFcE8'
const PublicResolverAddress = '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5'
const UniversalResolverAddress = '0xb7B7DAdF4D42a08B3eC1d3A1079959Dfbc8CFfCC'

// Create Contracts
const ensRegistry = new ethers.Contract(
  ENSRegistryAddress,
  ENSRegistryABI.abi,
  signer
);

const baseRegistrar = new ethers.Contract(
  BaseRegistrarAddress,
  BaseRegistrarABI.abi,
  signer
)

const ethRegistrarController = new ethers.Contract(
  ETHRegistrarControllerAddress,
  ETHRegistrarControllerABI.abi,
  signer
)

const dnsRegistrar = new ethers.Contract(
  DNSRegistrarAddress,
  DNSRegistrarABI.abi,
  signer
)

const reverseRegistrar = new ethers.Contract(
  ReverseRegistrarAddress,
  ReverseRegistrarABI.abi,
  signer
)

const nameWrapper = new ethers.Contract(
  NameWrapperAddress,
  NameWrapperABI.abi,
  signer
);

const publicResolver = new ethers.Contract(
  PublicResolverAddress,
  PublicResolverABI.abi,
  signer
)

const universalResolver = new ethers.Contract(
  UniversalResolverAddress,
  UniversalResolverABI.abi,
  signer
)

// Test Contract
const testContract = new ethers.Contract(
  '0x78495eF4Cb1B00C307Eca9e6FDB4bF3569400573',
  TestContractABI.abi,
  signer
)

// console.log("Stored message in test contract:", await testContract.message());

function App() {
  // Unit Conversion
  const [ethNum, setEthNum] = useState('')
  const [parsedEth, setParsedEth] = useState('0')
  const [weiNum, setWeiNum] = useState('')
  const [parsedWei, setParsedWei] = useState('0')

  // Blockchain Information
  const [blockNumber, setBlockNumber] = useState(0)

  // Wallet Information
  const [address, setAddress] = useState('')
  const [accountBalanceWei, setAccountBalanceWei] = useState(0n)
  const [accountBalanceEth, setAccountBalanceEth] = useState('0')

  // ENS Information
  const [ensName, setEnsName] = useState('')
  const [ensNameAddress, setEnsNameAddress] = useState('')
  const [ensDomainName, setEnsDomainName] = useState('')
  const [registerEnsDomainNameMessage, setRegisterEnsDomainNameMessage] = useState('')

  const [resolvedEnsName, setResolvedEnsName] = useState('')
  const [resolvedEnsNameMessage, setResolvedEnsNameMessage] = useState('')
  const [resolvedTextRecordName, setResolvedTextRecordName] = useState('')
  const [resolvedTextRecordKey, setResolvedTextRecordKey] = useState('')
  const [resolvedTextRecordMessage, setResolvedTextRecordMessage] = useState('')

  const [textRecordName, setTextRecordName] = useState('')
  const [textRecordKey, setTextRecordKey] = useState('')
  const [textRecordValue, setTextRecordValue] = useState('')
  const [textRecordMessage, setTextRecordMessage] = useState('')

  const [wrappedDomainName, setWrappedDomainName] = useState('')

  const [subname, setSubname] = useState('')
  const [domainName, setDomainName] = useState('')

  // Show Information
  function showInformation() {
    // Importing User Keys from the ENV File
    const privateKeys = {
      'Alchemy Key': alchemyKey,
      'Wallet Private Key': walletPrivateKey
    }

    console.log('Private Keys: ', privateKeys)

    // // Creating a Wallet
    // console.log('Wallet Information...\n')
    // console.log('Wallet: ', wallet)
    // console.log('Wallet Address: ', wallet.address)

    // // Creating a Provider and Signer
    // console.log('Provider and Signer...\n')
    // console.log('Provider: ', provider)
    // console.log('Signer: ', signer)

    // Created ENS Contracts
    const ensContracts = {
      'ENS Registry': ensRegistry,
      'Base Registrar': baseRegistrar,
      'ETH Registrar Controller': ethRegistrarController,
      'DNS Registrar': dnsRegistrar,
      'Reverse Registrar': reverseRegistrar,
      'Name Wrapper': nameWrapper,
      'Public Resolver': publicResolver,
      'Universal Resolver': universalResolver
    }

    console.log('ENS Contracts: ', ensContracts)
  }

  // Unit Conversion
  function parseEth(num: string) {
    const formattedWei = parseEther(num).toString()

    return setParsedEth(formattedWei)
  }

  function formatWei(num: string) {
    const formattedEth = formatEther(num)

    return setParsedWei(formattedEth)
  }

  // Blockchain Information
  async function checkBlockNumber() {
    const blockNumber = await provider.getBlockNumber();

    setBlockNumber(blockNumber)

    return blockNumber
  }

  // Wallet Information
  async function getAccountBalance(account: string) {
    const balanceWei = await provider.getBalance(account)
    const balanceEth = formatEther(balanceWei)

    setAccountBalanceWei(balanceWei)
    setAccountBalanceEth(balanceEth)

    return {
      'wei': balanceWei,
      'eth': balanceEth
    }
  }

  async function connectToMetaMask() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed.')
    }

    await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    console.log('Returning Signer: ', signer)

    return signer
  }

  // ENS Information
  function createEnsSepoliaDeployment(ensName: string) {
    if (!ensName.includes('.eth')) {
      return setRegisterEnsDomainNameMessage('This name does not include ".eth". which is necessary. Please add and try again.')
    }

    setRegisterEnsDomainNameMessage('Registering ENS domain name...')

    const name = getLabel(ensName)
    const duration = 31536000 // 60 * 60 * 24 * 365
    const secret = hexlify(ethers.randomBytes(32))

    console.log('Name: ', name)
    console.log('Duration: ', duration)
    console.log('Secret: ', secret)

    setRegisterEnsDomainNameMessage(`Creating domain name for ${name}.eth...`)

    createName()

    async function createName() {
      const registrationObject = {
        label: name,
        owner: signerAddress, // Your personal wallet is now the owner
        duration: duration,
        secret: secret,
        resolver: PublicResolverAddress, // '0x0000000000000000000000000000000000000000' = null, meaning no resolver is set
        data: [],
        reverseRecord: 1, // 0 reverse record flag set to 0
        referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }

      console.log('Registration Object: ', registrationObject)
      console.log('ETH Registrar Controller: ', ethRegistrarController)

      const commitment = await ethRegistrarController.makeCommitment(registrationObject)

      console.log('Commitment: ', commitment)

      console.log('Sending commit...')
      setRegisterEnsDomainNameMessage('Sending commit...')

      const tx1 = await ethRegistrarController.commit(commitment)
      await tx1.wait()

      console.log('Commit sent. Waiting 60 seconds...')
      setRegisterEnsDomainNameMessage('Commit sent. Waiting 60 seconds...')

      await new Promise ((r) => setTimeout(r, 60000))

      console.log('Waited 60 seconds!')
      setRegisterEnsDomainNameMessage('Waited 60 seconds!')

      console.log('Registering...')
      setRegisterEnsDomainNameMessage('Registering...')

      const tx2 = await ethRegistrarController.register(registrationObject, {
        value: BigInt('3125000000003490') // 0.003125 ETH
      })

      await tx2.wait()

      // ENS Domain Name Created Successfully
      console.log(`ENS name "${name}.eth" registered!`)
      setRegisterEnsDomainNameMessage(`ENS name "${name}.eth" registered!`)

      console.log(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
      setRegisterEnsDomainNameMessage(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)

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
    if (!ensName.includes('.eth')) {
      return setResolvedEnsNameMessage('This name does not include ".eth". which is necessary. Please add and try again.')
    }

    setResolvedEnsNameMessage('Allowing resolution...')

    const node = ethers.namehash(ensName)

    console.log('Node: ', node)
    console.log('Signer Address: ', signerAddress)

    const tx3 = await publicResolver['setAddr'](node, signerAddress)
    await tx3.wait()

    console.log('Address record set.')
    setResolvedEnsNameMessage('Address record set.')

    await provider.resolveName(ensName)

    console.log('Address record set successfully! You should now be able to resolve the name.')
    setResolvedEnsNameMessage('Address record set successfully! You should now be able to resolve the name.')
  }

  async function resolveName(ensName: string) {
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

  async function resolveTextRecord(ensName: string, key: string) {
    setResolvedTextRecordMessage(`Getting ${key} text record for ${ensName}...`)

    const resolver = await provider.getResolver(ensName)

    if (resolver) {
      const value = await resolver.getText(key)

      if (value) {
        setResolvedTextRecordMessage(`The ${key} text record has a value of ${value}.`)
      } else {
        setResolvedTextRecordMessage(`The key: ${key} does not have a stored value or does not exist.`)
      }
    } else {
      setResolvedTextRecordMessage('Resolver is null. Try again.')
    }
  }

  async function setTextRecord(ensName: string) {
    setTextRecordMessage('Creating text record...')

    const node = ethers.namehash(ensName)
    const tx = await publicResolver.setText(node, textRecordKey, textRecordValue);

    await tx.wait();

    setTextRecordMessage(`Text record created: ${textRecordKey} = ${textRecordValue}`)
  }

  async function wrapName(ensName: string) {
    const label = getLabel(ensName)
    const tokenId = getTokenId(ensName)
    const owner = await baseRegistrar.ownerOf(tokenId);

    console.log('ENS Domain Name: ', ensName)
    console.log('Label: ', label)
    console.log('Token ID: ', tokenId)
    console.log('Owner of Token ID: ', owner);

    console.log('NameWrapper Address', nameWrapper.target)
    console.log("Public Resolver:", publicResolver.target)

    await baseRegistrar.setApprovalForAll(nameWrapper.target, true);

    const nameWrapperOwner = await nameWrapper.ownerOf(tokenId);

    console.log("NameWrapper Owner:", nameWrapperOwner);

    // Wrap ETH Domain Name to 2nd Level Domain
    const tx = await nameWrapper.wrapETH2LD(
      label,
      signer.address,
      0,
      publicResolver.target
    );

    console.log("Transaction Hash:", tx);

    console.log("Waiting for transaction to confirm...");
    await tx.wait();
    console.log(`${ensName} has been wrapped successfully!`);
  }

  async function setSubnameForDomainName(ensName: string, subname: string) {
    const parentName = ensName
    const subLabel = subname
    const subName = `${subLabel}.${parentName}`

    console.log('Parent Name: ', parentName)
    console.log('Subname: ', subName)

    const parentNode = namehash(parentName)

    await nameWrapper.setSubnodeOwner(
      parentNode,
      subLabel,
      signerAddress,
      0, // Fuses
      0  // Expiry
    )

    console.log(`Subname "${subName}" created and owned by ${signerAddress}`)
  }

  // MetaMask
  async function createEnsSepoliaDeploymentWithMetaMask(ensName: string) {
    const mmSigner = await connectToMetaMask()

    const ethRegistrarController = new ethers.Contract(
      ETHRegistrarControllerAddress,
      ETHRegistrarControllerABI.abi,
      mmSigner
    )

    console.log('Signer: ', mmSigner)

    if (!ensName.includes('.eth')) {
      return setRegisterEnsDomainNameMessage('This name does not include ".eth". which is necessary. Please add and try again.')
    }

    setRegisterEnsDomainNameMessage('Registering ENS domain name...')

    const name = getLabel(ensName)
    const duration = 31536000 // 60 * 60 * 24 * 365
    const secret = hexlify(ethers.randomBytes(32))

    console.log('Name: ', name)
    console.log('Duration: ', duration)
    console.log('Secret: ', secret)

    setRegisterEnsDomainNameMessage(`Creating domain name for ${name}.eth...`)

    createName()

    async function createName() {
      const registrationObject = {
        label: name,
        owner: mmSigner.address, // Your personal wallet is now the owner
        duration: duration,
        secret: secret,
        resolver: PublicResolverAddress, // '0x0000000000000000000000000000000000000000' = null, meaning no resolver is set
        data: [],
        reverseRecord: 1, // 0 reverse record flag set to 0
        referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }

      console.log('Registration Object: ', registrationObject)
      console.log('ETH Registrar Controller: ', ethRegistrarController)

      const commitment = await ethRegistrarController.makeCommitment(registrationObject)

      console.log('Commitment: ', commitment)

      console.log('Sending commit...')
      setRegisterEnsDomainNameMessage('Sending commit...')

      const tx1 = await ethRegistrarController.commit(commitment)
      await tx1.wait()

      console.log('Commit sent. Waiting 60 seconds...')
      setRegisterEnsDomainNameMessage('Commit sent. Waiting 60 seconds...')

      await new Promise ((r) => setTimeout(r, 60000))

      console.log('Waited 60 seconds!')
      setRegisterEnsDomainNameMessage('Waited 60 seconds!')

      console.log('Registering...')
      setRegisterEnsDomainNameMessage('Registering...')

      const tx2 = await ethRegistrarController.register(registrationObject, {
        value: BigInt('3125000000003490') // 0.003125 ETH
      })

      await tx2.wait()

      // ENS Domain Name Created Successfully
      console.log(`ENS name "${name}.eth" registered!`)
      setRegisterEnsDomainNameMessage(`ENS name "${name}.eth" registered!`)

      console.log(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
      setRegisterEnsDomainNameMessage(`See ENS profile here: https://sepolia.app.ens.domains/${name}.eth`)
    }
  }

  async function allowResolutionWithMetaMask(ensName: string) {
    const mmSigner = await connectToMetaMask()
    const provider = new ethers.BrowserProvider(window.ethereum)

    if (!ensName.includes('.eth')) {
      return setResolvedEnsNameMessage('This name does not include ".eth". which is necessary. Please add and try again.')
    }

    setResolvedEnsNameMessage('Allowing resolution...')

    const node = ethers.namehash(ensName)

    console.log('Node: ', node)
    console.log('Signer Address: ', mmSigner.address)

    const publicResolver = new ethers.Contract(
      PublicResolverAddress,
      PublicResolverABI.abi,
      mmSigner
    )

    const tx3 = await publicResolver['setAddr'](node, mmSigner.address)
    await tx3.wait()

    console.log('Address record set.')
    setResolvedEnsNameMessage('Address record set.')

    await provider.resolveName(ensName)

    console.log('Address record set successfully! You should now be able to resolve the name.')
    setResolvedEnsNameMessage('Address record set successfully! You should now be able to resolve the name.')
  }

  async function wrapNameWithMetaMask(ensName: string) {
    const mmSigner = await connectToMetaMask()
    const provider = new ethers.BrowserProvider(window.ethereum)

    const nameWrapper = new ethers.Contract(
      NameWrapperAddress,
      NameWrapperABI.abi,
      mmSigner
    );

    const publicResolver = new ethers.Contract(
      PublicResolverAddress,
      PublicResolverABI.abi,
      mmSigner
    )

    const baseRegistrar = new ethers.Contract(
      BaseRegistrarAddress,
      BaseRegistrarABI.abi,
      mmSigner
    )

    const label = getLabel(ensName)
    const tokenId = getTokenId(ensName)
    const owner = await baseRegistrar.ownerOf(tokenId);

    console.log('ENS Domain Name: ', ensName)
    console.log('Label: ', label)
    console.log('Token ID: ', tokenId)
    console.log('Owner of Token ID: ', owner);

    console.log('NameWrapper Address', nameWrapper.target)
    console.log("Public Resolver:", publicResolver.target)

    await baseRegistrar.setApprovalForAll(nameWrapper.target, true);

    const nameWrapperOwner = await nameWrapper.ownerOf(tokenId);

    console.log("NameWrapper Owner:", nameWrapperOwner);

    // Wrap ETH Domain Name to 2nd Level Domain
    const tx = await nameWrapper.wrapETH2LD(
      label,
      mmSigner.address,
      0,
      publicResolver.target
    );

    console.log("Transaction Hash:", tx);

    console.log("Waiting for transaction to confirm...");
    await tx.wait();
    console.log(`${ensName} has been wrapped successfully!`);
  }

  async function setSubnameForDomainNameWithMetaMask(ensName: string, subname: string) {
    const mmSigner = await connectToMetaMask()

    const nameWrapper = new ethers.Contract(
      NameWrapperAddress,
      NameWrapperABI.abi,
      mmSigner
    );

    const parentName = ensName
    const subLabel = subname
    const subName = `${subLabel}.${parentName}`

    console.log('Parent Name: ', parentName)
    console.log('Subname: ', subName)

    const parentNode = namehash(parentName)

    await nameWrapper.setSubnodeOwner(
      parentNode,
      subLabel,
      mmSigner.address,
      0, // Fuses
      0  // Expiry
    )

    console.log(`Subname "${subName}" created and owned by ${signerAddress}`)
  }

  // Helper Functions
  function getTokenId(ensName: string) {
    const label = getLabel(ensName)
    const bytes = toUtf8Bytes(label)

    return keccak256(bytes)
  }

  function getLabel(ensName: string) {
    return ensName.split('.')[0]
  }

  return (
    <div className='contentContainer'>
      <h1 className='mainHeader'> Ethereum Playground </h1>

      {/* User Information */}
      <h2> User Information </h2>

      <div className='block user'>
        <p><span className='bold'>Wallet Public Address:</span> {wallet.address} </p>

        <div>
          <button onClick={() => {showInformation()}}> Display Information in Console </button>
        </div>
      </div>

      {/* Unit Conversion */}
      <h2> Unit Conversion </h2>

      <div className='block'>
        <h2> Convert ETH to Wei </h2>

        <p><span className='bold'>ETH:</span></p>
        <input type="number" onChange={(e) => setEthNum(e.target.value)} />

        <div>
          <button onClick={() => {parseEth(ethNum)}}> Convert {ethNum} ETH to Wei </button>
        </div>

        <p><span className='bold'>Converted ETH:</span> {parsedEth} wei </p>
      </div>

      <div className='block'>
        <h2> Convert Wei to ETH </h2>

        <p><span className='bold'>Wei:</span></p>
        <input type="number" onChange={(e) => setWeiNum(e.target.value)} />

        <div>
          <button onClick={() => {formatWei(weiNum)}}> Convert {weiNum} Wei to ETH </button>
        </div>

        <p><span className='bold'>Converted Wei:</span> {parsedWei} ETH </p>
      </div>

      {/* Blockchain Information */}
      <h2> Blockchain </h2>

      <div className='block'>
        <h2> Get Current Block Number </h2>

        <div>
          <button onClick={() => {checkBlockNumber()}}> Check Current Block # </button>
        </div>

        <p><span className='bold'>Current Block Number on Sepolia:</span> {blockNumber} </p>
      </div>

      {/* Wallet Information */}
      <h2> Wallets </h2>

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
        <p><span className='bold'>Account Balance on Sepolia (Wei):</span> {accountBalanceWei} wei </p>
        <p><span className='bold'>Account Balance on Sepolia (ETH):</span> {accountBalanceEth} ETH </p>
      </div>

      <div className='block'>
        <h2> Sign in to MetaMask </h2>

        <div>
          <button onClick={() => {connectToMetaMask()}}> Sign w/ MetaMask </button>
        </div>
      </div>

      {/* ENS Information */}
      <h2> ENS </h2>

      <div className='block'>
        <h2> Register an ENS Domain Name (Requires Gas) </h2>

        <ul>
          <li> Make sure to change your private key in the .env file if the account already has a registered ENS domain. </li>
          <li> Make sure to have enough ETH in your account (&#62; 0.0032 ETH) for gas fees. </li>
          <li> You will have to "allow resolution" below in order to resolve the ENS name. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <div>
          <button onClick={() => {createEnsSepoliaDeployment(ensDomainName)}}> Create ENS Domain Name </button>
        </div>

        <p><span className='bold'>Message:</span> {registerEnsDomainNameMessage} </p>

        {/* Allow ENS Domain Name Resolution */}

        <h2> Allow ENS Domain Name Resolution </h2>

        <p> The process of loading information about a name is called resolution. The resolution process has many parts. Most notably the Registry, multiple Registrars (ETH Registrar, DNS Registrar, Reverse Registrar, etc) and the concept of a Resolver. </p>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setResolvedEnsName(e.target.value)} />

        <div>
          <button onClick={() => {allowResolution(resolvedEnsName)}}> Allow ENS Domain Name Resolution </button>
        </div>

        <p><span className='bold'>Message:</span> {resolvedEnsNameMessage} </p>
      </div>

      <div className='block'>
        <h2> Resolve an ENS Name </h2>

        <p> Resolving an ENS name means to load information about an ENS name, like it's address. </p>

        <ul>
          <li> Try it with <i>vitalik.eth</i>. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setEnsName(e.target.value)} />

        <div>
          <button onClick={() => {resolveName(ensName)}}> Resolve ENS Name </button>
        </div>

        <p><span className='bold'>Address:</span> {ensNameAddress} </p>
      </div>

      <div className='block'>
        <h2> Resolve a Text Record </h2>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setResolvedTextRecordName(e.target.value)} />

        <p><span className='bold'>Text Record Key:</span></p>
        <input type="text" onChange={(e) => setResolvedTextRecordKey(e.target.value)} />

        <div>
          <button onClick={() => {resolveTextRecord(resolvedTextRecordName, resolvedTextRecordKey)}}> Resolve Text Record </button>
        </div>

        <p><span className='bold'>Address:</span> {resolvedTextRecordMessage} </p>
      </div>

      <div className='block'>
        <h2> Set Text Record (Requires Gas) </h2>

        <p> Text records are key-value pairs like email, avatar, and url. </p>
        <p> In order to set text records, the account with the private key must be the owner of the ENS domain name. </p>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setTextRecordName(e.target.value)} />

        <p><span className='bold'>Key:</span></p>
        <input type="text" onChange={(e) => setTextRecordKey(e.target.value)} />

        <p><span className='bold'>Value:</span></p>
        <input type="text" onChange={(e) => setTextRecordValue(e.target.value)} />

        <div>
          <button onClick={() => {setTextRecord(textRecordName)}}> Set Text Record </button>
        </div>

        <p><span className='bold'>Message:</span> {textRecordMessage} </p>
      </div>

      <div className='block'>
        <h2> Wrap Name </h2>

        <p> Wrapping a name means turning it into an ERC-1155 NFT (NameWrapper Contract) from an ERC-721 (BaseRegistrar), allowing the ENS domain to behave like an NFT, unlocking powerful features, control, and composability. </p>

        <ul>
          <li> Fine-grained control over what can be done with the name using fuses. </li>
          <li> Create subdomains, wrap those subdomains, assign permissions per subdomain. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setWrappedDomainName(e.target.value)} />

        <div>
          <button onClick={() => {wrapName(wrappedDomainName)}}> Wrap Name </button>
        </div>
      </div>

      <div className='block'>
        <h2> Create Subname </h2>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setDomainName(e.target.value)} />

        <p><span className='bold'>Subname:</span></p>
        <input type="text" onChange={(e) => setSubname(e.target.value)} />

        <div>
          <button onClick={() => {setSubnameForDomainName(domainName, subname)}}> Create Subname </button>
        </div>
      </div>

      {/* MetaMask Information */}
      <h2> MetaMask </h2>

      <div className='block'>
        <h2> Register an ENS Domain Name (w/ MetaMask) </h2>

        <ul>
          <li> Make sure to change your private key in the .env file if the account already has a registered ENS domain. </li>
          <li> Make sure to have enough ETH in your account (&#62; 0.0032 ETH) for gas fees. </li>
          <li> You will have to "allow resolution" below in order to resolve the ENS name. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <div>
          <button onClick={() => {createEnsSepoliaDeploymentWithMetaMask(ensDomainName)}}> Create ENS Domain Name w/ MetaMask </button>
        </div>

        <p><span className='bold'>Message:</span> {registerEnsDomainNameMessage} </p>

        {/* Allow ENS Domain Name Resolution */}

        <h2> Allow ENS Domain Name Resolution </h2>

        <p> The process of loading information about a name is called resolution. The resolution process has many parts. Most notably the Registry, multiple Registrars (ETH Registrar, DNS Registrar, Reverse Registrar, etc) and the concept of a Resolver. </p>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setResolvedEnsName(e.target.value)} />

        <div>
          <button onClick={() => {allowResolutionWithMetaMask(resolvedEnsName)}}> Allow ENS Domain Name Resolution </button>
        </div>

        <p><span className='bold'>Message:</span> {resolvedEnsNameMessage} </p>
      </div>

      <div className='block'>
        <h2> Wrap Name (w/ MetaMask) </h2>

        <p> Wrapping a name means turning it into an ERC-1155 NFT (NameWrapper Contract) from an ERC-721 (BaseRegistrar), allowing the ENS domain to behave like an NFT, unlocking powerful features, control, and composability. </p>

        <ul>
          <li> Fine-grained control over what can be done with the name using fuses. </li>
          <li> Create subdomains, wrap those subdomains, assign permissions per subdomain. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setWrappedDomainName(e.target.value)} />

        <div>
          <button onClick={() => {wrapNameWithMetaMask(wrappedDomainName)}}> Wrap Name w/ MetaMask </button>
        </div>
      </div>

      <div className='block'>
        <h2> Create Subname w/ MetaMask</h2>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setDomainName(e.target.value)} />

        <p><span className='bold'>Subname:</span></p>
        <input type="text" onChange={(e) => setSubname(e.target.value)} />

        <div>
          <button onClick={() => {setSubnameForDomainNameWithMetaMask(domainName, subname)}}> Create Subname </button>
        </div>
      </div>

      {/* Features */}
      <h2> Features </h2>

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
