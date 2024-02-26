// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CampaignFactory
{
    address[] private _deployedCampaigns;
    mapping(address => string) private _campaigns;
    address private _creator;
    constructor()
    {
        _creator = msg.sender;
    }

    function createCampaign(string memory name, uint minAmount) external{
        address newCampaign = address(new Campaign(name, minAmount, msg.sender));
        _deployedCampaigns.push(newCampaign);
        _campaigns[newCampaign] = name;
    }

    function getDeployedCampaigns() external view returns(address[] memory)
    {
        return _deployedCampaigns;
    }

    function getCampaignDescription(address campaignAddress) external view returns(string memory)
    {
        return _campaigns[campaignAddress];
    }
    function getCreatorAddress() external view returns(address){
        return _creator;
    }
}

contract Campaign
{
    struct Request {
        string name;
        string description;
        uint amount;
        address payable receiver;
        uint approvalsCount;
        uint requiredApprovals;
        bool canSubmit;
        bool complete;
        mapping(address => bool) approvers;
    }


    string _description;
    address private _manager;
    mapping(address => uint) public approvers;
    uint _approversCount;
    uint private _minimumContribution;
    mapping(string => Request) public requests;

    constructor (string memory description, uint minimum, address mngr)
    {
        require(minimum > 0);
        _manager = mngr;
        _description = description; 
        _minimumContribution = minimum;
    }

    function getManager() external view returns (address)
    {
        return _manager;
    }

    function getDescription() external view returns (string memory)
    {
        return _description;
    }
    function getContributors() external view returns(uint){
        return _approversCount;
    }
    function getMinimumContribution() external view returns(uint){
        return _minimumContribution;
    }

    function getContractBalance() external view returns(uint){
        return address(this).balance / 1 ether;
    }
 

    function contribute() public payable{
        require(msg.value / 1 ether >= _minimumContribution);
        require(approvers[msg.sender] == 0);
        approvers[msg.sender] = (msg.value / 1 ether);
        _approversCount++;

    }

    function triggerCampaignRequest(string memory name, string memory description, uint amount, uint requiredApprovals, address payable receiver) restricted external {
        
        require(bytes(name).length > 0);
        require(bytes(description).length > 0);
        require(amount > 0);
        require(amount <= address(this).balance / 1 ether);
        require(requiredApprovals > 0);
        require(requiredApprovals <= _approversCount);
        Request storage req = requests[name];
        
        req.name= name;
        req.description = description;
        req.amount = amount;
        req.receiver = receiver;
        req.approvalsCount=  0;
        req.requiredApprovals = requiredApprovals;
        req.complete= false;
    }

    function voteRequest(string memory reqName, bool isApproval ) external
    {
        require(msg.sender != _manager);

        Request storage req = requests[reqName];

        require(bytes(req.name).length > 0);
        require(bytes(req.name).length == bytes(reqName).length);
        //check isApprover
        require(approvers[msg.sender] > 0);
        //check notVoted
        require(!req.canSubmit);
        require(!req.complete);
        //check reqExists
        require(!req.approvers[msg.sender]);

        req.approvers[msg.sender] = true;
        
        if(isApproval){
            req.approvalsCount++;
        }

        if(req.approvalsCount >= req.requiredApprovals) {
            req.canSubmit = true;
        }
        //check reqNotComplete
    }

    function submitRequest(string memory reqName) restricted external {
        Request storage req = requests[reqName];
        require(bytes(req.name).length > 0);
        require(bytes(req.name).length == bytes(reqName).length);
        require(req.canSubmit && !req.complete);
        require(address(this).balance / 1 ether >= req.amount);
        req.receiver.transfer(req.amount * 1 ether);

        req.complete = true;
    }

    modifier restricted() {
        require(msg.sender == _manager);
        _;
    }
}