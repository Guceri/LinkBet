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
    this.setState({ network }) 
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
        this.setState({ balance, maxBet, minBet, network, wrongNetwork: false })
      }
    })
    //last but not least, enable the buttons & input
    this.setState({ loading: false })
  }

  async makeBet(bet, amount) {
    //randomSeed - one of the components from which will be generated final random value
    const networkId = await this.state.web3.eth.net.getId() 
    if(networkId!==4) {
      this.setState({wrongNetwork: true})
    } else if(typeof this.state.account !=='undefined' && this.state.account !==null){
      var randomSeed = Math.floor(Math.random() * Math.floor(1e9))

      //Send bet to the contract and wait for the verdict
      this.state.contract.methods.game(bet, randomSeed).send({from: this.state.account, value: amount}).on('transactionHash', (hash) => {
        this.setState({ loading: true })
        this.state.contract.events.Result({}, async (error, event) => {
          const verdict = event.returnValues.winAmount
          console.log(this.state.web3.utils.fromWei(verdict, 'ether'))
          
          if(verdict === '0') {
            window.alert('lose :(')
          } else {
            window.alert('WIN!')
          }

          //Prevent error when user logout, while waiting for the verdict
          if(this.state.account!==null && typeof this.state.account!=='undefined'){
            const balance = await this.state.web3.eth.getBalance(this.state.account)
            const maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress)
            this.setState({ balance: balance, maxBet: maxBet })
          }
          this.setState({ loading: false })
        })
      }).on('error', (error) => {
        window.alert('Error')
      })
    } else {
      window.alert('Problem with account or network')
    }
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
      event: null,
      loading: true,
      network: null,
      maxBet: 0,
      minBet: 0,
      web3: null,
      wrongNetwork: true,
      contractAddress: null
    }

    this.makeBet = this.makeBet.bind(this)
    this.setState = this.setState.bind(this)
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