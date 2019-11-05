import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
//import Notehash from "./contracts/Notehash.json";
import getWeb3 from "./utils/getWeb3";
import { Buffer } from 'buffer';
import "./App.css";

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
  
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

class App extends Component {
  state = { buffer : null, storageValue: 0, web3: null, accounts: null, contract: null };

  onChange = (event) => {
    event.preventDefault()
    console.log("file caputred")
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({bufffer : Buffer(reader.result)})
    }
  }

  onSubmit =  (event) =>{
    event.preventDefault()
    console.log('Submitting file')
    //console.log('buffer', Buffer(this.state.buffer))
    ipfs.add(this.state.buffer, (error, result)=> {
    console.log("ipfs Results", result)

      if(error){
        console.error(error)
        return
      }


    })
  
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = SimpleStorageContract.networks[networkId];


      const instance = new web3.eth.Contract(
      SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
     //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1> upload your Promissory Note </h1>
        <div>The stored value is: {this.state.storageValue}</div>

        <div>
              <form onSubmit = {this.onSubmit}> 
             
              <input type = 'file' onChange = {this.onChange} />
              <input type = 'submit' />

              </form>

        </div>
      </div>
    );
  }
}

export default App;
