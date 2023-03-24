// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// This contract demonstrates a basic DAO (Decentralized Autonomous Organization) system called ApeDao.

contract ApeDao {

    event NewProposal(bytes32 proposalID, address to, uint deadline, uint requestedFund);
    event Voted(bytes32 indexed proposalID, address indexed voter, uint votePower, bool vote);
    event ProposalApproved(bytes32 indexed proposalID, address executor, address to, uint requestedFund);
    event ProposalRejected(bytes32 indexed proposalID, address executor);

    uint256 constant MINIMUM_REQUESTABLE = 10;

    // Defines the data structure of a proposal.
    struct Proposal{
        uint yesVotes;
        uint noVotes;
        uint deadline;
        address to;

        // proposal hash keccak256(toUtf8Bytes([name, slug, owner, description, website, endDate, createDate, desiredAmount, account].toString()));
        bytes32 proposalID;

        mapping(uint => bool)votes;

        bool executed;
        uint requestedFund;
    }

    mapping(bytes32 => Proposal) public proposals;
    uint public numberOfProposal;
    uint public treasuryBalance;
    uint public availableTreasury;

    // Defines the token smart contract (ERC721) according to which the proposals will be managed and provides a reference to it.
    IERC721 ARClubNFT;
    IERC20 ApeCoin;

    constructor(address _nftAddress, address _ApeCoinAddress){
        ApeCoin = IERC20(_ApeCoinAddress);
        ARClubNFT = IERC721(_nftAddress);
    }


    // An access modifier that ensures only ARClubNFT owners (APEDAO members) can perform the task.
    modifier ARCHolderOnly {
        require(ARClubNFT.balanceOf(msg.sender) > 0,"You are not an ApeDao member, you need at least 1 Ape Refi Club NFT");
        _;
    }

    // An access modifier that checks if the proposal is still active.
    modifier activeProposal(bytes32 _proposalID){
        require(block.timestamp < proposals[_proposalID].deadline);
        _;
    }

    // An access modifier that checks whether the proposal has been successful.
    modifier finishedProposalOnly(bytes32 _proposalID){
        require(block.timestamp > proposals[_proposalID].deadline,"Wait for the deadline");
        _;
    }

    // Creates a new proposal with the specified parameters.
    function receiveApeCoins(uint _amount) public {
        require(ApeCoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        treasuryBalance += _amount;
        availableTreasury += _amount;
    }

    function createProposal(address _to, bytes32 _proposalID, uint _requestedFund) external {
        if(availableTreasury > MINIMUM_REQUESTABLE){
            require(_requestedFund <= availableTreasury / 2, 'Requested amount is too high');
        }
        else {
            require(_requestedFund <= availableTreasury, 'Requested amount is too high');
        }
        Proposal storage proposal = proposals[_proposalID];
        proposal.to = _to;
        proposal.proposalID = _proposalID;
        proposal.deadline = block.timestamp + 7 days;
        numberOfProposal ++;
        availableTreasury -= _requestedFund;
        emit NewProposal(_proposalID, _to, proposal.deadline, _requestedFund);
    }

    // Cast votes for the proposal.
    function voteTheProposal(bool vote, bytes32 proposalID, uint[] memory NFTsToVote) external ARCHolderOnly activeProposal(proposalID) {
        uint votePover = NFTsToVote.length;
        require(votePover > 0,"You need some nft to gain vote power");
        Proposal storage proposal = proposals[proposalID];
        for(uint i; i< votePover; i++){
            require(ARClubNFT.ownerOf(NFTsToVote[i]) == msg.sender,"You are not the owner");
            require(!proposal.votes[NFTsToVote[i]],"Already voted");
            proposal.votes[NFTsToVote[i]] = true;
        }
        if(vote){
            proposal.yesVotes += votePover;
        }
        else{
            proposal.noVotes += votePover;
        }
        emit Voted(proposalID, msg.sender, votePover, vote);

    }

    // Executes the proposal and sends the funds.
    function executeProposal(bytes32 proposalID) external finishedProposalOnly(proposalID) {
        Proposal storage proposal = proposals[proposalID];
        require(!proposal.executed,"Proposal is already executed");
        if(proposal.yesVotes > proposal.noVotes) {
            bool success = ApeCoin.transfer(proposal.to, proposal.requestedFund);
            require(success,"Transfer failed");
            proposal.executed = true;
            treasuryBalance -= proposal.requestedFund;
            emit ProposalApproved(proposalID, msg.sender, proposal.to, proposal.requestedFund);
        }
        else{
            availableTreasury += proposal.requestedFund;
            emit ProposalRejected(proposalID, msg.sender);
        }
    }


    // Accepts incoming payments
    receive() external payable{}

    // Fallback function
    fallback() external payable{}
}
