// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ApesRefiClub is ERC721Enumerable, Ownable {
    IERC721 public bayc;
    IERC20 public ApeCoin;
    address public daoAddress;
    bytes32 public merkleRoot;

    mapping(uint256 => uint256) public baycTokenToCarbonDebt;
    mapping(uint256 => uint256) public baycTokenToPaidDebt;

    event CarbonDebtPaidPercentage(address owner, uint256 indexed baycTokenId, uint256 percentage);

    constructor(
        address _baycAddress,
        address _stablecoinAddress,
        address _daoAddress,
        bytes32 _merkleRoot,
        uint256[] memory tokenIds
    ) ERC721("ApesRefiClub", "ARC") {
        bayc = IERC721(_baycAddress);
        ApeCoin = IERC20(_ApeCoinAddress);
        daoAddress = _daoAddress;
        merkleRoot = _merkleRoot;

        mintApesRefiClub(tokenIds);
    }

    function mintApesRefiClub(uint256[] memory tokenIds) private onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _mint(address(this), tokenIds[i]);
        }
    }

    function payCarbonDebt(uint256 baycTokenId, uint256 amount, bytes32[] calldata merkleProof) external {
        require(bayc.ownerOf(baycTokenId) != address(0), "Invalid BAYC token ID");
        require(amount > 0, "Amount must be greater than 0");

        bytes32 node = keccak256(abi.encodePacked(baycTokenId, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid Merkle proof");

        ApeCoin.transferFrom(msg.sender, address(this), amount);
        baycTokenToPaidDebt[baycTokenId] += amount;

        uint256 carbonDebt = baycTokenToCarbonDebt[baycTokenId];
        require(carbonDebt > 0, "Carbon debt is not set");

        uint256 paidPercentage = (baycTokenToPaidDebt[baycTokenId] * 100) / carbonDebt;
        if (paidPercentage >= 100) {
            safeTransferFrom(address(this), bayc.ownerOf(baycTokenId), baycTokenId);
            stablecoin.transfer(daoAddress, carbonDebt);
        }

        emit CarbonDebtPaidPercentage(bayc.ownerOf(baycTokenId), baycTokenId, paidPercentage);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/nft/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString(), "/metadata"))
            : "";
    }
}