// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crab is ERC721, Ownable {
    string public baseTokenURI = "ipfs://bafybeicgdtah2266yh7nhedwjg7eh2eb5sw4ilcysoybxpe63rit6akdxe";
    uint256 private nextTokenId;
    string public tokenName = "CrabCoin";
    string public tokenSymbol = "CRB";
    uint16 public initialMint = 20000;

    constructor() ERC721(tokenName, tokenSymbol) Ownable(msg.sender) {
        nextTokenId = initialMint;
    }

    function mint() external payable {
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