import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const contractAddress = '0xA2a9DEe59636cBBFE705bcf0dF92a95E46901012';
const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_addr",
				"type": "uint256"
			}
		],
		"name": "remove",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "storePerson",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "filelist",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPerson",
		"outputs": [
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "myMap",
		"outputs": [
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function App() {
	const [web3, setWeb3] = useState(null);
	const [contract, setContract] = useState(null);
	const [index, setIndex] = useState('');
	const [cid, setCid] = useState('');
	const [storedCid, setStoredCid] = useState('');
  
	useEffect(() => {
	  // Connect to MetaMask or any other Web3 provider
	  if (window.ethereum) {
		const web3Instance = new Web3(window.ethereum);
		setWeb3(web3Instance);
  
		// Initialize the contract
		const contractInstance = new web3Instance.eth.Contract(ABI, contractAddress);
		setContract(contractInstance);
  
		// Request account access if not already granted
		window.ethereum.enable().then(accounts => {
		  // You can use accounts[0] as the current account for transactions
		});
	  } else {
		console.error('Web3 provider not found. Please install MetaMask or another provider.');
	  }
	}, []);
  
	const handleStorePerson = async () => {
	  if (!web3 || !contract) {
		console.error('Web3 or contract not initialized.');
		return;
	  }
  
	  const accounts = await web3.eth.getAccounts();
	  const indexNum = parseInt(index);
	  
	  contract.methods
		.storePerson(indexNum, cid)
		.send({ from: accounts[0] })
		.on('transactionHash', () => {
		  console.log('Transaction submitted');
		})
		.on('receipt', (receipt) => {
		  console.log('Transaction mined:', receipt);
		})
		.on('error', (error) => {
		  console.error('Transaction error:', error);
		});
	};
  
	const handleGetPerson = async () => {
	  if (!web3 || !contract) {
		console.error('Web3 or contract not initialized.');
		return;
	  }
  
	  const indexNum = parseInt(index);
	  
	  const result = await contract.methods.getPerson(indexNum).call();
	  setStoredCid(result);
	};
  
	return (
	  <div className="App">
		<h1>Smart Contract Interaction</h1>
		<div>
		  <input
			type="text"
			placeholder="Index"
			value={index}
			onChange={(e) => setIndex(e.target.value)}
		  />
		  <input
			type="text"
			placeholder="CID"
			value={cid}
			onChange={(e) => setCid(e.target.value)}
		  />
		  <button onClick={handleStorePerson}>Store Person</button>
		</div>
		<div>
		  <button onClick={handleGetPerson}>Get Person</button>
		  <div>Stored CID: {storedCid}</div>
		</div>
	  </div>
	);
  }
  
  export default App;
