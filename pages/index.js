import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/MyContract.sol/MyContract.json"; // Import the contract ABI JSON

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [myContract, setMyContract] = useState(undefined); // State variable for the contract instance
  const [balance, setBalance] = useState(undefined);
  const [ownerAddress, setOwnerAddress] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const myContractABI = atm_abi.abi; // Use the imported ABI

  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const getWallet = async () => {
    const wallet = new ethers.Wallet(privateKey);
    setEthWallet(wallet);

    const address = await wallet.getAddress();
    setAccount(address);
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("Phantom wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]); // Update account state
    // once wallet is set we can get a reference to our deployed contract
    getMyContract();
  };

  const getMyContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const myContractInstance = new ethers.Contract(contractAddress, myContractABI, signer);
    setMyContract(myContractInstance); // Set contract instance in state
  };

  const getBalance = async () => {
    if (myContract) {
      const contractBalance = await myContract.getBalance();
      setBalance(contractBalance.toNumber());
    }
  };

  const getOwnerAddress = async () => {
    if (myContract) {
      const owner = await myContract.owner();
      setOwnerAddress(owner);
    }
  };

  const transferOwnership = async (newOwnerAddress) => {
    try {
      if (myContract) {
        await myContract.transferOwnership(newOwnerAddress);
        // Assuming you want to refresh owner address after transferring ownership
        getOwnerAddress();
      } else {
        console.error("Contract instance not initialized");
      }
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };
  
  const checkOwner = async () => {
    if (myContract) {
      const isOwner = await myContract.checkOwner();
      console.log("Is owner:", isOwner);
    }
  };

  const deposit = async () => {
    try {
      if (myContract) {
        const tx = await myContract.deposit(ethers.utils.parseEther("1"));
        await tx.wait();
        console.log("Deposit successful");
        getBalance();
      } else {
        console.error("Contract instance not initialized");
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };
  
  const withdraw = async () => {
    try {
      if (myContract) {
        const tx = await myContract.withdraw(ethers.utils.parseEther("1"));
        await tx.wait();
        console.log("Withdrawal successful");
        getBalance();
      } else {
        console.error("Contract instance not initialized");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Phantom wallet in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Phantom wallet</button>
      );
    }

    // Fetch balance and owner address if not fetched yet
    if (balance === undefined) {
      getBalance();
    }
    if (ownerAddress === undefined) {
      getOwnerAddress();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Contract Owner: {ownerAddress}</p>
        <button onClick={() => transferOwnership("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")}>Transfer Ownership</button>
        <button onClick={checkOwner}>Check Owner</button>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to MyContract ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
