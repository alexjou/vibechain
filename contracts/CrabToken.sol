// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crab is ERC721, Ownable {
    string public baseTokenURI =
        "ipfs://bafybeicgdtah2266yh7nhedwjg7eh2eb5sw4ilcysoybxpe63rit6akdxe";
    uint256 private nextTokenId;
    uint256 public initialMint;
    string public tokenName = "CrabCoin";
    string public tokenSymbol = "CRB";

    constructor(uint256 _initialMint) ERC721(tokenName, tokenSymbol) Ownable(msg.sender) {
        initialMint = _initialMint;
        nextTokenId = _initialMint;
    }

    function mint() external {
        //require(msg.value == 0, "Este NFT e gratuito, nao envie ETH");
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }
}
