//SPDX-License-Identifier: MIT


import "./RoyaltiesToken.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



pragma solidity ^0.8.4;

contract Marketplace is PullPayment, Ownable, ReentrancyGuard{
    using SafeMath for uint;


    struct tokenDetails{
        bool inSale;
        uint price;
    }

    mapping(uint=>tokenDetails) public tokensInfo;


    constructor(){

    }



    function setInSale(address nftAddress ,uint tokenId, uint priceInWei)external{
        require(msg.sender == RoyaltiesToken(nftAddress).ownerOf(tokenId), "You are not the token Owner!");
        tokensInfo[tokenId].inSale = true;
        tokensInfo[tokenId].price = priceInWei;
    }



    function buyToken(
        address nftAddress,
        uint tokenId
        )external payable{

            uint salePrice = tokensInfo[tokenId].price;
            address tokenOwner = RoyaltiesToken(nftAddress).ownerOf(tokenId);

            require(msg.value == salePrice, "Set right Price");
            require(msg.sender != tokenOwner, "Can't buy your own token!");

            tokensInfo[tokenId].inSale = false;

            (address receiver, uint royaltyAmount) =
             RoyaltiesToken(nftAddress).royaltyInfo(tokenId, salePrice);

            require(receiver != address(0) && tokenOwner != address(0),  "");

            uint amountToSendForSold = salePrice - royaltyAmount;

            tokensInfo[tokenId].price = 0;

            _asyncTransfer(receiver, royaltyAmount);
            _asyncTransfer(tokenOwner, amountToSendForSold);

            RoyaltiesToken(nftAddress).safeTransferFrom(
                tokenOwner,
                msg.sender,
                tokenId
                );
        }



    function withdrawPayments(address payable payee) public virtual override nonReentrant{
        require(msg.sender == payee, "Can't use others Address!");
        require(payments(payee) > 0, "Nothing to Receive");
        super.withdrawPayments(payee);
    }
}
