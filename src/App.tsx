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

// Come back and update types
let provider: any
let signer: any
let network: any

let ensRegistry: any
let baseRegistrar: any
let ethRegistrarController: any
let dnsRegistrar: any
let reverseRegistrar: any
let nameWrapper: any
let publicResolver: any
let universalResolver: any

async function updateProviderServer() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed.')
  }

  await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  provider = new ethers.BrowserProvider(window.ethereum)
  signer = await provider.getSigner()
  network = await provider.getNetwork()
}

async function createEnsContracts() {
  // Create ENS Contracts: new ethers.Contract(address, abi, signerOrProvider)

  // Contract Addresses (Sepolia: https://docs.ens.domains/learn/deployments)
  const ENSRegistryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const BaseRegistrarAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
  const ETHRegistrarControllerAddress = '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968'
  const DNSRegistrarAddress = '0x5a07C75Ae469Bf3ee2657B588e8E6ABAC6741b4f'
  const ReverseRegistrarAddress = '0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6'
  const NameWrapperAddress = '0x0635513f179D50A207757E05759CbD106d7dFcE8'
  const PublicResolverAddress = '0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5'
  const UniversalResolverAddress = '0xb7B7DAdF4D42a08B3eC1d3A1079959Dfbc8CFfCC'

  ensRegistry = new ethers.Contract(
    ENSRegistryAddress,
    ENSRegistryABI.abi,
    signer
  );

  baseRegistrar = new ethers.Contract(
    BaseRegistrarAddress,
    BaseRegistrarABI.abi,
    signer
  )

  ethRegistrarController = new ethers.Contract(
    ETHRegistrarControllerAddress,
    ETHRegistrarControllerABI.abi,
    signer
  )

  dnsRegistrar = new ethers.Contract(
    DNSRegistrarAddress,
    DNSRegistrarABI.abi,
    signer
  )

  reverseRegistrar = new ethers.Contract(
    ReverseRegistrarAddress,
    ReverseRegistrarABI.abi,
    signer
  )

  nameWrapper = new ethers.Contract(
    NameWrapperAddress,
    NameWrapperABI.abi,
    signer
  )

  publicResolver = new ethers.Contract(
    PublicResolverAddress,
    PublicResolverABI.abi,
    signer
  )

  universalResolver = new ethers.Contract(
    UniversalResolverAddress,
    UniversalResolverABI.abi,
    signer
  )
}

// Create Universal Variables
await updateProviderServer()
await createEnsContracts()

// // Test Contract
// const testContract = new ethers.Contract(
//   '0x78495eF4Cb1B00C307Eca9e6FDB4bF3569400573',
//   TestContractABI.abi,
//   signer
// )
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
    // Creating a Provider and Signer
    console.log('Provider: ', provider)
    console.log('Provider MetaMask?: ', window.ethereum.isMetaMask)
    console.log('Signer: ', signer)
    console.log('Signer Address: ', signer.address)
    console.log('Network Name: ', network.name)
    console.log('Network Chain ID: ', network.chainId)

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
  function convertEthToWei(num: string) {
    const formattedWei = parseEther(num).toString()

    return setParsedEth(formattedWei)
  }

  function convertWeiToEth(num: string) {
    const formattedEth = formatEther(num)

    return setParsedWei(formattedEth)
  }

  // Blockchain Information
  async function getBlockNumber() {
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

  // MetaMask
  async function createEnsDomainName(ensName: string) {
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
        owner: signer.address,
        duration: duration,
        secret: secret,
        resolver: publicResolver.target, // '0x0000000000000000000000000000000000000000' = null, meaning no resolver is set
        data: [],
        reverseRecord: 1, // 0 reverse record flag set to 0
        referrer: '0x0000000000000000000000000000000000000000000000000000000000000000'
      }

      const commitment = await ethRegistrarController.makeCommitment(registrationObject)

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

  async function allowEnsDomainNameResolution(ensName: string) {
    if (!ensName.includes('.eth')) {
      return setResolvedEnsNameMessage('This name does not include ".eth". which is necessary. Please add and try again.')
    }

    console.log('Allowing resolution...')
    setResolvedEnsNameMessage('Allowing resolution...')

    const node = ethers.namehash(ensName)

    const tx = await publicResolver['setAddr'](node, signer.address)
    await tx.wait()

    console.log('Address record set.')
    setResolvedEnsNameMessage('Address record set.')

    await provider.resolveName(ensName)

    console.log('Address record set successfully! You should now be able to resolve the name.')
    setResolvedEnsNameMessage('Address record set successfully! You should now be able to resolve the name.')
  }

  async function resolveEnsDomainName(ensName: string) {
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
    console.log(`Getting ${key} text record for ${ensName}...`)
    setResolvedTextRecordMessage(`Getting ${key} text record for ${ensName}...`)

    const resolver = await provider.getResolver(ensName)

    if (resolver) {
      const value = await resolver.getText(key)

      if (value) {
        console.log(`The ${key} text record has a value of ${value}.`)
        setResolvedTextRecordMessage(`The ${key} text record has a value of ${value}.`)
      } else {
        console.log(`The key: ${key} does not have a stored value or does not exist.`)
        setResolvedTextRecordMessage(`The key: ${key} does not have a stored value or does not exist.`)
      }
    } else {
      console.log('Resolver is null. Try again.')
      setResolvedTextRecordMessage('Resolver is null. Try again.')
    }
  }

  async function createTextRecord(ensName: string) {
    console.log('Creating text record...')
    setTextRecordMessage('Creating text record...')

    const node = ethers.namehash(ensName)
    const tx = await publicResolver.setText(node, textRecordKey, textRecordValue);

    await tx.wait();

    console.log(`Text record created: ${textRecordKey} = ${textRecordValue}`)
    setTextRecordMessage(`Text record created: ${textRecordKey} = ${textRecordValue}`)
  }

  async function wrapEnsDomainName(ensName: string) {
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

  async function createSubname(ensName: string, subname: string) {
    const parentName = ensName
    const subLabel = subname
    const subName = `${subLabel}.${parentName}`

    console.log('Parent Name: ', parentName)
    console.log('Subname: ', subName)

    const parentNode = namehash(parentName)

    await nameWrapper.setSubnodeOwner(
      parentNode,
      subLabel,
      signer.address,
      0, // Fuses
      0  // Expiry
    )

    console.log(`Subname "${subName}" created and owned by ${signer.address}`)
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

      <h2> User Information </h2>

      {/* Display Information */}
      <div className='block user'>
        <p><span className='bold'>Wallet Public Address:</span> {signer.address} </p>

        <div>
          <button onClick={() => {showInformation()}}> Display Information in Console </button>
        </div>
      </div>

      <h2> Unit Conversion </h2>

      {/* Convert ETH to Wei */}
      <div className='block'>
        <h2> Convert ETH to Wei </h2>

        <p><span className='bold'>ETH:</span></p>
        <input type="number" onChange={(e) => setEthNum(e.target.value)} />

        <div>
          <button onClick={() => {convertEthToWei(ethNum)}}> Convert {ethNum} ETH to Wei </button>
        </div>

        <p><span className='bold'>Converted ETH:</span> {parsedEth} wei </p>
      </div>

      {/* Convert Wei to ETH */}
      <div className='block'>
        <h2> Convert Wei to ETH </h2>

        <p><span className='bold'>Wei:</span></p>
        <input type="number" onChange={(e) => setWeiNum(e.target.value)} />

        <div>
          <button onClick={() => {convertWeiToEth(weiNum)}}> Convert {weiNum} Wei to ETH </button>
        </div>

        <p><span className='bold'>Converted Wei:</span> {parsedWei} ETH </p>
      </div>

      <h2> Blockchain </h2>

      {/* Get Current Block Number */}
      <div className='block'>
        <h2> Get Current Block Number </h2>

        <div>
          <button onClick={() => {getBlockNumber()}}> Check Current Block # </button>
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
        <p><span className='bold'>Account Balance on Sepolia (Wei):</span> {accountBalanceWei} wei </p>
        <p><span className='bold'>Account Balance on Sepolia (ETH):</span> {accountBalanceEth} ETH </p>
      </div>

      <h2> MetaMask </h2>

      {/* Register an ENS Domain Name */}
      <div className='block'>
        <h2> Register an ENS Domain Name (0.0032 Gas) </h2>

        <ul>
          <li> Make sure to change your private key in the .env file if the account already has a registered ENS domain. </li>
          <li> Make sure to have enough ETH in your account (&#62; 0.0032 ETH) for gas fees. </li>
          <li> You will have to "allow resolution" below in order to resolve the ENS name. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setEnsDomainName(e.target.value)} />

        <div>
          <button onClick={() => {createEnsDomainName(ensDomainName)}}> Create ENS Domain Name w/ MetaMask </button>
        </div>

        <p><span className='bold'>Message:</span> {registerEnsDomainNameMessage} </p>

        {/* Allow ENS Domain Name Resolution */}

        <h2> Allow ENS Domain Name Resolution (0.0001 Gas) </h2>

        <p> The process of loading information about a name is called resolution. The resolution process has many parts. Most notably the Registry, multiple Registrars (ETH Registrar, DNS Registrar, Reverse Registrar, etc) and the concept of a Resolver. </p>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setResolvedEnsName(e.target.value)} />

        <div>
          <button onClick={() => {allowEnsDomainNameResolution(resolvedEnsName)}}> Allow ENS Domain Name Resolution </button>
        </div>

        <p><span className='bold'>Message:</span> {resolvedEnsNameMessage} </p>
      </div>

      {/* Resolve an ENS Domain Name */}
      <div className='block'>
        <h2> Resolve an ENS Domain Name </h2>

        <p> Resolving an ENS name means to load information about an ENS name, like it's address. </p>

        <ul>
          <li> Try it with <i>vitalik.eth</i>. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setEnsName(e.target.value)} />

        <div>
          <button onClick={() => {resolveEnsDomainName(ensName)}}> Resolve ENS Name </button>
        </div>

        <p><span className='bold'>Address:</span> {ensNameAddress} </p>
      </div>

      {/* Set a Text Record */}
      <div className='block'>
        <h2> Set Text Record (0.0001 Gas) </h2>

        <p> Text records are key-value pairs like email, avatar, and url. </p>
        <p> In order to set text records, the account with the private key must be the owner of the ENS domain name. </p>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setTextRecordName(e.target.value)} />

        <p><span className='bold'>Key:</span></p>
        <input type="text" onChange={(e) => setTextRecordKey(e.target.value)} />

        <p><span className='bold'>Value:</span></p>
        <input type="text" onChange={(e) => setTextRecordValue(e.target.value)} />

        <div>
          <button onClick={() => {createTextRecord(textRecordName)}}> Set Text Record </button>
        </div>

        <p><span className='bold'>Message:</span> {textRecordMessage} </p>
      </div>

      {/* Resolve a Text Record */}
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

      {/* Wrap Name */}
      <div className='block'>
        <h2> Wrap Name (0.0003 Gas) </h2>

        <p> Wrapping a name means turning it into an ERC-1155 NFT (NameWrapper Contract) from an ERC-721 (BaseRegistrar), allowing the ENS domain to behave like an NFT, unlocking powerful features, control, and composability. </p>

        <ul>
          <li> Fine-grained control over what can be done with the name using fuses. </li>
          <li> Create subdomains, wrap those subdomains, assign permissions per subdomain. </li>
        </ul>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setWrappedDomainName(e.target.value)} />

        <div>
          <button onClick={() => {wrapEnsDomainName(wrappedDomainName)}}> Wrap Name w/ MetaMask </button>
        </div>
      </div>

      {/* Create Subname */}
      <div className='block'>
        <h2> Create Subname (0.0002 Gas) </h2>

        <p><span className='bold'> ENS Domain Name (w/ .eth):</span></p>
        <input type="text" onChange={(e) => setDomainName(e.target.value)} />

        <p><span className='bold'>Subname:</span></p>
        <input type="text" onChange={(e) => setSubname(e.target.value)} />

        <div>
          <button onClick={() => {createSubname(domainName, subname)}}> Create Subname </button>
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
