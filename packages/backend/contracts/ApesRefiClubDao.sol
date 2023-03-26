// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// This contract demonstrates a basic DAO (Decentralized Autonomous Organization) system called ApeDao.

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract ApesRefiClubDao {

    event NewProposal(bytes32 proposalID, address to, uint deadline, uint requestedFund);
    event Voted(bytes32 indexed proposalID, address indexed voter, bool vote);
    event ProposalApproved(bytes32 indexed proposalID, address executor, address to, uint requestedFund);
    event ProposalRejected(bytes32 indexed proposalID, address executor);
    event VoteTracked(uint256 indexed nftId, address indexed voter);
    event VoteRemoved(uint256 indexed nftId, address indexed voter);

    address public EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    uint256 constant MINIMUM_REQUESTABLE = 10;
    uint256 constant MINIMUM_WAIT_DAY = 7;
    
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
    mapping(bytes32 => bool) public proposalExists;
    mapping(uint=>address[]) track;
    uint public numberOfProposal;
    uint public activeRequestedFund;

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

    // Checks the proposal not existed
    modifier existedProposalOnly(bytes32 _proposalID) {
        require(proposalExists[_proposalID], "Proposal doesn't exist");
        _;
    }

    // Checks if the proposal existed already
    modifier nonExistedProposalOnly(bytes32 _proposalID) {
        require(!proposalExists[_proposalID], "This proposal already exist");
        _;
    }

    // An access modifier that checks if the proposal is still active.
    modifier activeProposal(bytes32 _proposalID){
        require(block.timestamp < proposals[_proposalID].deadline);
        _;
    }

    // An access modifier that checks whether the proposal has been successful.
    modifier finishedProposalOnly(bytes32 _proposalID){
        require(block.timestamp >= proposals[_proposalID].deadline,"Wait for the deadline");
        _;
    }

    // Creates a new proposal with the specified parameters.
    function createProposal(address _to, bytes32 _proposalID, uint _requestedFund) nonExistedProposalOnly(_proposalID) external {
        require(_requestedFund > 0, "Requsted fund must be higher than 0");
        uint ApeCoinBalance = ApeCoin.balanceOf(address(this));
        if((ApeCoinBalance - activeRequestedFund) > MINIMUM_REQUESTABLE){
            require(_requestedFund <= (ApeCoinBalance - activeRequestedFund) / 2, 'Requested amount is too high');
        }
        else {
            require(_requestedFund <= (ApeCoinBalance - activeRequestedFund), 'Requested amount is too high');
        }
        Proposal storage proposal = proposals[_proposalID];
        proposal.to = _to;
        proposal.proposalID = _proposalID;
        proposal.deadline = block.timestamp + MINIMUM_WAIT_DAY * 1 days;
        numberOfProposal ++;
        activeRequestedFund += _requestedFund; 
        proposalExists[_proposalID] = true;
        emit NewProposal(_proposalID, _to, proposal.deadline, _requestedFund);
    }

    // Cast votes for the proposal.
    function voteTheProposal(bool vote, bytes32 proposalID, uint nftID) external ARCHolderOnly existedProposalOnly(proposalID) activeProposal(proposalID) {
        Proposal storage proposal = proposals[proposalID];
        require(ARClubNFT.ownerOf(nftID) == msg.sender,"You are not the owner");
        require(!proposal.votes[nftID],"Already voted");
        proposal.votes[nftID] = true;
        if(vote){
            proposal.yesVotes += 1;
        }
        else{
            proposal.noVotes += 1;
        }
        emit Voted(proposalID, msg.sender, vote);

        for(uint i; i < track[nftID].length; i++){
            IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            0x6b48D121458e0038d0EBEe13c9dd6D6EFA214a74, // from channel
            track[nftID][0], // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Vote Alert", // this is notificaiton title
                        "+", // segregator
                        "We have news", // notification body
                        "APE", // notification body
                        Strings.toString(nftID), // notification body
                        " voted ", // notification body
                        vote ? "Yes":"No",
                        " for the Proposal ", // notification body
                        bytes32ToString(proposalID)
                    )
                )
            )
        );
        }
        
    }

    // Executes the proposal and sends the funds.
    function executeProposal(bytes32 proposalID) external finishedProposalOnly(proposalID) existedProposalOnly(proposalID) {
        Proposal storage proposal = proposals[proposalID];
        require(!proposal.executed,"Proposal is already executed");
        if(proposal.yesVotes > proposal.noVotes) {
            bool success = ApeCoin.transfer(proposal.to, proposal.requestedFund);
            require(success,"Transfer failed");
            proposal.executed = true;
            emit ProposalApproved(proposalID, msg.sender, proposal.to, proposal.requestedFund);
        }
        else{
            emit ProposalRejected(proposalID, msg.sender);
            proposal.executed = true;
        }
        activeRequestedFund -= proposal.requestedFund; 
        
    }
    // Anyone who wants to know which NFT got which vote can follow
    function trackVote(uint nftId) external {
        track[nftId].push(msg.sender);
        emit VoteTracked(nftId, msg.sender);
    }
    //NFT's vote tracking process can be stopped if desired
    function removeFromTrackVote(uint256 nftId) public {
        uint256 i;
        for(i = 0; i < track[nftId].length; i++) {
            if(track[nftId][i] == msg.sender) {
                break;
            }
        }
        require(i < track[nftId].length, "Address not found");
        emit VoteRemoved(nftId, msg.sender);
        track[nftId][i] = track[nftId][track[nftId].length - 1];
        track[nftId].pop();
    }

    // Helper function to convert address to string
    
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
    // Accepts incoming payments
    receive() external payable{}

    // Fallback function
    fallback() external payable{}
}
