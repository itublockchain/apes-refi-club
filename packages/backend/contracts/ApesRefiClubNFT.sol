// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ApesRefiClubNFT is ERC721Enumerable, Ownable, IERC721Receiver {
    // Only the owner of the original NFT can mint in the first given time
    uint256 constant MIN_TIME_GIVEN_TO_OWNER = 30 days;

    string constant polybaseURI =
        "https://testnet.polybase.xyz/v0/collections/pk";

    IERC721 public bayc;
    IERC20 public ApeCoin;

    address public daoAddress;
    bytes32 public merkleRoot;

    string public verifiedCollectionName;
    string public unverifiedCollectionName;
    string public collectionOwnerPubKey;
    string public collectionHeader;

    uint public deployedTime;

    mapping(uint256 => bool) private _verifiedTokens;


    event CarbonDebtPaid(uint256 indexed baycTokenId, address indexed owner);

    constructor(
        address _baycAddress,
        address _ApeCoinAddress,
        bytes32 _merkleRoot,
        string memory _unverifiedCollectionName,
        string memory _verifiedCollectionName,
        string memory _collectionOwnerPubKey,
        string memory _collectionHeader
    ) ERC721("ApesRefiClubNFT", "ARC") {
        bayc = IERC721(_baycAddress);
        ApeCoin = IERC20(_ApeCoinAddress);
        merkleRoot = _merkleRoot;
        verifiedCollectionName = _verifiedCollectionName;
        unverifiedCollectionName = _unverifiedCollectionName;
        collectionOwnerPubKey = _collectionOwnerPubKey;
        collectionHeader = _collectionHeader;
        deployedTime = block.timestamp;
    }

    function setDAOAddress(address _daoAddress) public onlyOwner {
        require(daoAddress == address(0), "DAO address already set");
        daoAddress = _daoAddress;
    }

    // NEED TO CONTROL

    function verify(
        bytes32[] memory proof,
        bytes32 leaf
    ) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function payCarbonDebt(
        uint256 baycTokenId,
        uint256 carbonDebt,
        bytes32[] memory proof
    ) external {
        require(daoAddress != address(0), "DAO address hasn't set yet");
        require(carbonDebt > 0, "Amount must be greater than 0");
        require(!_verifiedTokens[baycTokenId], "BAYC token already verified");
        //added
        if (block.timestamp < deployedTime + MIN_TIME_GIVEN_TO_OWNER) {
            require(
                bayc.ownerOf(baycTokenId) == msg.sender,
                "You are not the owner of the BAYC NFT"
            );
        }
        //*


        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(baycTokenId, carbonDebt))));

        require(verify(proof, leaf), "Invalid proof");

        ApeCoin.transferFrom(msg.sender, daoAddress, carbonDebt);
        _verifiedTokens[baycTokenId] = true;
        _safeMint(msg.sender, baycTokenId);
        
    }

    function _baseURI() internal view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    polybaseURI,
                    "%2F",
                    collectionOwnerPubKey,
                    "%2F",
                    collectionHeader,
                    "%2F",
                    unverifiedCollectionName,
                    "/"
                )
            );
    }

    function _baseURIVerified() internal view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    polybaseURI,
                    "%2F",
                    collectionOwnerPubKey,
                    "%2F",
                    collectionHeader,
                    "%2F",
                    verifiedCollectionName,
                    "/"
                )
            );
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            tokenId < 10000,
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();
        if (_verifiedTokens[tokenId]) {
            baseURI = _baseURIVerified();
        }
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        "records/",
                        Strings.toString(tokenId),
                        "?format=nft"
                    )
                )
                : "";
    }
}
