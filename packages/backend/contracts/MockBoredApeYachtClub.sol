// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract MockBoredApeYachtClub is ERC721, Ownable {
    constructor() ERC721("MockBoredApeYachtClub", "MBAYC") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function tokenURI(uint tokenId) public override pure returns(string memory) {
        require(tokenId < 10000, "Invalid token id");
        return string(abi.encodePacked("QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/", Strings.toString(tokenId)));
    }
}
