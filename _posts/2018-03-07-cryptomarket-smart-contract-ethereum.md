---
layout: post
title:  "CryptoMarket, a decentralized marketplace over Ethereum"
date:   2018-03-07
excerpt: "A smart-contract experiment: a decentralized marketplace that runs over the Ethereum Blockchain"
project: true
tag:
- ethereum
- blockchain
- english
comments: true
feature: https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png
showFeature: true
---
CryptoMarket is a smart contract. What does it mean? Is a marketplace that runs without any server, that cannot be censured and its security is based on cryptographic functions.

# Overview
![FrontEnd Preview]({{site.url}}/assets/img/post-image/cryptoPreview.png)
The project is composed of two parts:
 - The smart contract, written in Solidity 
 - The front-end, written in HTML5 that shows the smart contract status

The main contract `Marketplace`, inherit the storage function by another contract `ProductBox`. So, the products array and every function related to that are in the `ProductBox` contract, instead, every function related to the orders are in the `Marketplace` contract.

### Authentication
Of course, as every smart contract, its data are stored over the blockchain and are public. So, everyone can store data into this contract and can get the products. Each product created in this marketplace is associated with an Ethereum address. Only that address can delete that product.

![CryptoMarket]({{site.url}}//assets/img/post-image/cryptomarket.png)
# How to try it
In order to try it, you need to have something that injects Web3 into the site. The simplest way to satisfy that dependency is to use Google Chrome with [MetaMask Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

The project is deployed over the Rinkeby Test Net. So, if you use MetaMask, open in then select Rinkeby
![Rinkeby Test Net]({{site.url}}/assets/img/post-image/metamask.png). If you have no Ether on Rinkeby Test Net, you can receive some free Ether [here](https://www.rinkeby.io/#faucet) in order to try the contract.

The frontend is hosted on this site: [CryptoMarket FrontEnd](https://apagiaro.it/cryptomarket)

# Privacy (not yet implemented)
In order to guarantee the privacy of the customers, each seller (i.e. everyone) can store a public key into a dedicated array and then the shipping address can be inserted ciphered. This feature is free to the customer because of the cypher function is executed before every transaction, by the javascript code.

Every line of code is available on GitHub: [CryptoMarket Repository](https://github.com/alessandro308/CryptoMarket)
