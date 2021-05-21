import React, { Component } from 'react';
import Loading from './Loading'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3'
import './App.css';

import BettingGame from '../abis/BettingGame.json'

class App extends Component {
  async componentDidMount() {
    //variables
    let accounts, network, balance, web3, maxBet, minBet, contract, contractAddress
    //================================================================================================ 
    //Web3
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum) 
    }else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
    web3 = window.web3
    this.setState({ web3 })//for use in Loading component
    //================================================================================================ 
    //Network
    network = await window.ethereum.request({ method: 'net_version' })
    if(network === "4"){
      //Smart Contract 
      contractAddress = '0xCb8264ADba345e763c544F3645Ff16431fc259a4' //rinkeby    
      contract = new web3.eth.Contract(BettingGame.abi, contractAddress);
      maxBet = await web3.eth.getBalance(contractAddress)
      minBet = await contract.methods.weiInUsd().call()
      this.setState({ wrongNetwork: false, contract, contractAddress, minBet, maxBet })
    }else {
      this.setState({ wrongNetwork: true })
      alert("Please switch to the Rinkeby Network")
    }
    //================================================================================================  
    //Accounts
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    //Update the ACCOUNT DATA when user initially connect
    if(typeof accounts[0]!=='undefined' && accounts[0]!==null) {
      balance = await web3.eth.getBalance(accounts[0])
      this.setState({ account: accounts[0], balance: balance })
    }else {
      this.setState({ account: null, balance: 0 })
    }
    //================================================================================================ 
    //Account Change
    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log("change")
      if(typeof accounts[0] !== 'undefined'  && accounts[0]!==null){
        balance = await web3.eth.getBalance(accounts[0])
        this.setState({ account: accounts[0], balance: balance })
      } else {
        this.setState({ account: null, balance: 0 })
      }
    })
    //================================================================================================
    //Network Change
    window.ethereum.on('chainChanged', async (chainId) => {
      network = parseInt(chainId, 16)
      if(network!==4){
        this.setState({ wrongNetwork: true })
        alert("Please switch to the Rinkeby Network")
      } else {
        balance = await web3.eth.getBalance(this.state.account)
        maxBet = await web3.eth.getBalance(this.state.contractAddress)
        minBet = await contract.methods.weiInUsd().call()
        this.setState({ balance, maxBet, minBet, wrongNetwork: false })
      }
    })
    //last but not least, enable the buttons & input
    this.setState({ loading: false })
  }

  async makeBet(bet, amount) {
    let balance, maxBet, minBet
    var randomSeed = Math.floor(Math.random() * Math.floor(1e9))
    //Send bet to the contract and wait for the verdict
    this.state.contract.methods.game(bet, randomSeed).send({from: this.state.account, value: amount}).on('transactionHash', (hash) => {
      this.setState({ loading: true})
      
      this.state.contract.events.Result({}, async (error, event) => {
        //check that the event is for user
        if (event.returnValues.player.toLowerCase() === this.state.account){
          const verdict = event.returnValues.winAmount
          if(verdict === '0') {
            alert('YOU LOSE!')
            balance = await this.state.web3.eth.getBalance(this.state.account)
            maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress)
            minBet = await this.state.contract.methods.weiInUsd().call()
            this.setState({ balance, maxBet, minBet })
          } else {
            alert('YOU WIN!')
            balance = await this.state.web3.eth.getBalance(this.state.account)
            maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress)
            minBet = await this.state.contract.methods.weiInUsd().call()
            this.setState({ balance, maxBet, minBet })
          }      
        }
      })
    }).then ( async () => {
      //update balance once ETH is sent to the smart contract
      balance = await this.state.web3.eth.getBalance(this.state.account)
      this.setState({ balance, loading: false })
      alert("Please be patient, it's in the hands of the oracles now...")
    })
  }

  onChange(value) {
    this.setState({'amount': value});
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      amount: null,
      balance: null,
      contract: null,
      loading: true,
      maxBet: 0,
      minBet: 0,
      web3: null,
      wrongNetwork: true,
      contractAddress: null
    }

    //to set state in components
    this.makeBet = this.makeBet.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>&nbsp;
        {this.state.wrongNetwork
          ? <div className="container-fluid mt-5 text-monospace text-center mr-auto ml-auto">
              <div className="content mr-auto ml-auto">
                <h1>Loading Network Data....</h1>
              </div>
            </div>
          : this.state.loading 
              ? <Loading
                  balance={this.state.balance}
                  maxBet={this.state.maxBet}
                  minBet={this.state.minBet}
                  web3={this.state.web3}
                />
              : <Main
                  amount={this.state.amount}
                  balance={this.state.balance}
                  makeBet={this.makeBet}
                  onChange={this.onChange}
                  maxBet={this.state.maxBet}
                  minBet={this.state.minBet}
                  loading={this.state.loading}
                  web3={this.state.web3}
                />
        }
      </div>
    )
  }
}

export default App;