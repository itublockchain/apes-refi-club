// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ApesRefiClub is ERC721Enumerable, Ownable, IERC721Receiver {
    IERC721 public bayc;
    IERC20 public ApeCoin;
    address public daoAddress;
    bytes32 public merkleRoot;

    mapping(uint256 => bool) private _claimedTokens;


    event Claimed(uint256 indexed baycTokenId, address indexed owner);

    constructor(
        address _baycAddress,
        address _ApeCoinAddress,
        address _daoAddress,
        bytes32 _merkleRoot
    ) ERC721("ApesRefiClub", "ARC") {
        bayc = IERC721(_baycAddress);
        ApeCoin = IERC20(_ApeCoinAddress);
        daoAddress = _daoAddress;
        merkleRoot = _merkleRoot;
    }

    function verify(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    

    function payCarbonDebt(uint256 baycTokenId, uint256 carbonDebt, bytes32[] memory proof) external {
    
        require(carbonDebt > 0, "Amount must be greater than 0");
        require(!_claimedTokens[baycTokenId], "BAYC token already claimed");


        bytes32 leaf = keccak256(abi.encodePacked(baycTokenId, carbonDebt));

        require(verify(proof, leaf), "Invalid proof");

        ApeCoin.transferFrom(msg.sender, daoAddress, carbonDebt);

        _claimedTokens[baycTokenId] = true;

        _safeMint(bayc.ownerOf(baycTokenId), baycTokenId);
        emit Claimed(baycTokenId, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/nft/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, "metadata/", tokenId))
            : "";
    }
}
    