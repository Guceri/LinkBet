![](public/eth.png)
##
## Link Betting Game
Major Topics Learned:
- deployment to testnet (Rinkeby) -> network specific contract interaction
- use Links pricefeed oracle to get ETH/USD price
- use Links VRF contract to get a random number
- ERC677 Token (LINK) -> makes working with oracles easier
- callback interaction with another contract
- commenting out unused variables to suppress warnings
- use of mapping to allow multiple pending states (bets) to ensure proper payouts 
- for loops in smart contracts
- react -> "componentWillMount" removed & "componentDidMount" used  

Resources:
- tutorial on Betting Game (from: [Dapp University](https://www.youtube.com/watch?v=YzCbaR15Xi4&t=971s))
- tutorial for getting a random number from [ChainLink](https://www.youtube.com/watch?v=JqZWariqh5s)

**NOTE**: My code has been modified and updated to fix general use bugs present in the Dapp University 
tutorial. MetaMask and React have gone through some changes which I have updated along with making the code
cleaner and easier to read (front-end).  

## Design

![](public/BettingGame.png)
![](public/VRF_cycle.png)

## Instructions
- Use Rinkeby test network and get funds from faucet
	- https://faucet.rinkeby.io/
	- request funds via twitter and then paste link to tweet and select the amount of eth you want
- Go to Link faucet and paste metaMask account
	- https://rinkeby.chain.link/
	- click on add token and copy/paste link address from smart contract

```
contract address:    0xCb8264ADba345e763c544F3645Ff16431fc259a4
owner account:       0x8f2B5EF30D3DEe90840bb7D4a8aC27A6266aAe5F
```

## UI

![](public/UI.png)
