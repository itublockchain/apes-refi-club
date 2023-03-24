// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "contracts/scalingEth/erc721a.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// This contract demonstrates a basic DAO (Decentralized Autonomous Organization) system called ApeDao.

contract ApeDao {

    event NewProposal(uint indexed proposalIndex, address indexed proposalOwner, address to, bytes32 description, uint deadline);
    event Voted(uint indexed proposalIndex, address indexed voter, uint votePower, bool vote);
    event ProposalExecuted(uint indexed proposalIndex, address indexed executor, address to, uint totalFund);
    event Refunded(uint indexed proposalIndex, address indexed refundee, uint refundedAmount);


    // Defines the data structure of a proposal.
    struct Proposal{
        address proposalOwner;
        uint yesVotes;
        uint noVotes;
        uint deadline;
        address to;
        //string description;
        bytes32 descriptionHash;

        mapping(uint => bool)voters;
        mapping(address => uint) addressToFundedAmount;

        bool executed;
        uint totalFund;
    }

    mapping(uint => Proposal) proposals;
    uint public numberOfProposal;
    uint public treasuryBalance;

    // Defines the token smart contract (ERC721) according to which the proposals will be managed and provides a reference to it.
    IERC721 ARClubNFT;
    IERC20 BARYCToken;

    constructor(address _nftAddress, address _ApeCoinAddress){
        BARYCToken = IERC20(_ApeCoinAddress);
        ARClubNFT = IERC721(_nftAddress);
    }

    enum Vote {
        yes,
        no
    }

    // An access modifier that ensures only ARClubNFT owners (APEDAO members) can perform the task.
    modifier ARCHolderOnly {
        require(ARClubNFT.balanceOf(msg.sender) > 0,"You are not an ApeDao member, you need at least 1 Ape Refi Club NFT");
        _;
    }

    // An access modifier that checks if the proposal is still active.
    modifier activeProposal(uint _proposalIndex){
        require(block.timestamp < proposals[_proposalIndex].deadline);
        _;
    }

    // An access modifier that checks whether the proposal has been successful.
    modifier successfulProposalOnly(uint _proposalIndex){
        require(block.timestamp > proposals[_proposalIndex].deadline,"Wait for the deadline");
        require(proposals[_proposalIndex].yesVotes > proposals[_proposalIndex].noVotes,"Proposal denied");
        _;
    }

    // An access modifier that checks whether the proposal has been rejected.
    modifier rejectedProposal(uint _proposalIndex){
        require(block.timestamp > proposals[_proposalIndex].deadline,"Wait for the deadline");
        require(proposals[_proposalIndex].yesVotes <= proposals[_proposalIndex].noVotes,"Successful proposal");
        _;
    }

    // Creates a new proposal with the specified parameters.
    // check archolderonly

    function receiveApeCoins(uint _amount) public {
        require(BARYCToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        treasuryBalance += _amount;
    }

    function createProposal(address _to, bytes32 _description) external ARCHolderOnly {
        Proposal storage proposal = proposals[numberOfProposal];
        proposal.proposalOwner = msg.sender;
        proposal.to = _to;
        proposal.descriptionHash = _description;
        proposal.deadline = block.timestamp + 7 days;
        emit NewProposal(numberOfProposal, msg.sender, _to, _description, proposal.deadline);
        numberOfProposal ++;
    }

    // Cast votes for the proposal.
    function voteTheProposal(Vote vote, uint proposalIndex, uint[] memory NFTsToVote) external payable ARCHolderOnly activeProposal(proposalIndex) {
        uint votePover = NFTsToVote.length;
        require(votePover > 0,"You need some nft to gain vote power");
        Proposal storage proposal = proposals[proposalIndex];
        for(uint i; i< votePover; i++){
            require(ARClubNFT.ownerOf(NFTsToVote[i]) == msg.sender,"You are not the owner");
            require(!proposal.voters[NFTsToVote[i]],"Already voted");
            proposal.voters[NFTsToVote[i]] = true;
        }
        if(vote == Vote.yes){
            proposal.yesVotes += votePover;
            proposal.addressToFundedAmount[msg.sender] += msg.value;
            proposal.totalFund += msg.value;
        }
        if(vote == Vote.no){
            proposal.noVotes += votePover;
        }
        emit Voted(proposalIndex, msg.sender, votePover, vote == Vote.yes);

    }

    // Executes the successful proposal and sends the funds.
    // check archolderonly
    function executeProposal(uint proposalIndex) external ARCHolderOnly successfulProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        require(!proposal.executed,"Proposal is already executed");
        proposal.executed = true;
        (bool success,)= proposal.to.call{value: proposal.totalFund}("");
        require(success,"Transfer failed");
        emit ProposalExecuted(proposalIndex, msg.sender, proposal.to, proposal.totalFund+treasuryBalance);

    }

    // Refunds the contributors of a rejected proposal.
    function refund(uint proposalIndex) external ARCHolderOnly rejectedProposal(proposalIndex){
        Proposal storage proposal = proposals[proposalIndex];
        require(proposal.addressToFundedAmount[msg.sender] > 0,"You have not");
        (bool success,)= proposal.to.call{value: proposal.addressToFundedAmount[msg.sender]}("");
        require(success,"Transfer failed");
        uint refundedAmount = proposal.addressToFundedAmount[msg.sender];
        proposal.addressToFundedAmount[msg.sender] = 0;
        emit Refunded(proposalIndex, msg.sender, refundedAmount);

    }

    // Accepts incoming payments
    receive() external payable{}

    // Fallback function
    fallback() external payable{}
}
