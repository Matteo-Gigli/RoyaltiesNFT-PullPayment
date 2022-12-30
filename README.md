# RoyaltiesNFT-PullPayment


<h2>💡 Royalties NFT & Pull Payments</h2>
<br>
<h3>Openzeppelin contracts used: </h3>
<h3>ERC2981.sol, PullPayments.sol, Ownable.sol, ERC721URIStorage.sol, Counters.sol, ReentrancyGuard.sol, SafeMath.sol</h3>
<br>
<br>

<h2>🖼️ RoyaltiesToken.sol</h2>
<br>
<h3>First of all we are going to initialize the Marketplace address, via initMarketplace() function.</h3>
<h3>After this we can go to mint our token/tokens at 1 wei price each.</h3>
<br>
<h3>ERC721 token inherit from ERC2981.sol, that means is allowed to set some royalties on the NFT.</h3>
<h3>As we can see ERC2981.sol is the standard for Royalties.</h3>
<h3>Contains different functions, and working on basis points (/10000), so if we want to set a 10 % of royalty will be 1000, as we can see in the</h3>
<h3>mintToken() function, where thanks to the _setTokenRoyalty() internal function from ERC2981.sol, we are going to set a 10% (1000) royalty for each token.</h3>
<h3>Who will receive this royalty is the owner of the contract.</h3>
<br>
<br>

<h3>📊 Marketplace.sol</h3>
<h3>This contract is the marketplace where we can set in sale our tokens and withdraw our ETH thanks to the PullPayment method, from PullPayments.sol</h3>
<h3>First of all we are going to set the sale, via setInSale() function.</h3>
<h3>After this we can go to use our buyToken() function.</h3>
<br>
<h3>PullPayments is one of the optimal solution to prevent reentrancy attack.</h3>
<h3>PullPayments.sol have different functions that we can use to transfer safely our ETH</h3>
<h3>buyToken() function use a pullPayment.sol function as _asyncTransfer()</h3>
<h3>_asyncTransfer() take 2 parameters like: receiverRoyaltyAddress, amountToReceive.</h3>
<h3>This functions "freeze" and set this funds for seller and for royaltiesOwner.</h3>
<h3>So using another function, in PullPayments.sol, called payments(address dest) we can retrive the amount we can pull out.</h3>
<h3>Obvoiusly is amount out is 0 and we will try to pull some eth out we will receive an error, instead we will receive our part of ETH</h3>

<br>
<br>

<h2>🔧 Stack Used:</h2>

<h3>Solidity</h3>
<h3>Hardhat</h3>
<h3>Ethers.js</h3>
<h3>Openzeppelin</h3>
