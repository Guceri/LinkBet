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
- Scaling Solutions -> use of mapping to allow multiple pending states (bets) to ensure proper payouts 


Resources:
- tutorial on Betting Game (from: [Dapp University](https://www.youtube.com/watch?v=YzCbaR15Xi4&t=971s))
- tutorial for getting a random number from [ChainLink](https://www.youtube.com/watch?v=JqZWariqh5s)

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
contract address:    0xD2513257A3dC8918c5f04cCEB1Fb10d82644aaEE
account:             0x8f2B5EF30D3DEe90840bb7D4a8aC27A6266aAe5F
```

## UI

![](public/UI.png)
