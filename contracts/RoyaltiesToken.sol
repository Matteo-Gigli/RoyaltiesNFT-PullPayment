//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Marketplace.sol";


contract RoyaltiesToken is Ownable, ERC721URIStorage ,ERC2981{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    Marketplace marketplace;

    string public provenanceHash = "";

    constructor(
        string memory name_,
        string memory symbol_
        )ERC721(name_, symbol_){}



    function initMarketplace(address marketplaceAddress)external onlyOwner{
        marketplace = Marketplace(marketplaceAddress);
    }



    function isApprovedForAll(address owner, address operator)public view virtual override returns (bool){
        return super.isApprovedForAll(owner, operator) || operator == address(marketplace);
    }



    function mintToken(uint quantity)external payable{
        require(msg.value == quantity * 1 wei, "Set Right Price!");
        for(uint i = 0; i < quantity; ++i){
            _tokenIds.increment();
            uint newId = _tokenIds.current();
            _setTokenRoyalty(newId, owner(), 1000);
            _safeMint(msg.sender, newId);
        }
        payable(owner()).transfer(msg.value);
    }


    function ProvenanceHash(string memory _provenanceHash)external onlyOwner{
        provenanceHash = _provenanceHash;
    }



    function _baseURI() internal view virtual override returns (string memory) {
        return provenanceHash;
    }



    function tokenURI(uint256 _tokenId) public override view returns (string memory) {
        string memory tokenId = Strings.toString(_tokenId);
        string memory uri = string(abi.encodePacked(_baseURI(), "/", tokenId, ".json"));
        return uri;
    }



    function _transfer(
        address from,
        address to,
        uint tokenId
    )internal virtual override{
        require(to != address(0), "");
        super._transfer(from, to, tokenId);
    }



    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
