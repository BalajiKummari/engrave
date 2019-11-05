import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Notehash from "./contracts/Notehash.json";
import getWeb3 from "./utils/getWeb3";
import { Buffer } from 'buffer';
import "./App.css";

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
  host: 'localhost', port: '5001', protocol: 'http'
})

class App extends Component {
  state = { noteId:null, noofnotes : null, web3: null, accounts: null, contract: null, buffer : null, resultHash : null };


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Notehash.networks[networkId];


      const instance = new web3.eth.Contract(
      Notehash.abi,
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


  onChange = (event) => {
    event.preventDefault()
    console.log("file caputred")
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer : Buffer(reader.result)}
      
      )
    }
  }

  onSubmit =  (event) =>{
    event.preventDefault()
    console.log('Submitting file')
    console.log('buffer', Buffer(this.state.buffer))
    ipfs.add(this.state.buffer, (error, result)=> {
    console.log("ipfs Results", result)
    this.setState(  { resultHash : result[0].hash })
      if(error){
        console.error(error)
        return
      }
    })
  } 

  addtochain = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    const response = await contract.methods.addhash(this.state.resultHash).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.noteId;

    // Update state with the result.
    this.setState({ noteId: response.from });
  };


  getinfo = async (event) => {
    
    const text = event.target.value
    console.log('id',text)

  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1> upload your Promissory Note </h1>

        <div>
              <form onSubmit = {this.onSubmit}> 
             
              <input type = 'file' onChange = {this.onChange} />
              <input type = 'submit' />

              </form>
              
              <h3> your Promissory Note is Store at IPFS Loaction</h3>
              <div> : {this.state.resultHash}  </div>
              <div>
              <button onClick = {this.addtochain}>Add the Note to block chain </button>
              <h3> your Promissory Note is Store at Blockchain Loaction</h3>
              <div> : {this.state.noteId}  </div>
              </div>
        </div>
        <div>
        <form name = 'form2' onSubmit = {this.onSubmit}> 
             
             <input type = 'text'  />
             <input type = 'submit' onSubmit = {this.getinfo} />
             </form>
             <h3> details of Note ID</h3>


        </div>
      </div>
    );
  }
}

export default App;
