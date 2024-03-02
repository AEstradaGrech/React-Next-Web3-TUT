// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CampaignFactory
{
    struct CampaignInfo{
        address creatorAddress;
        string name;
        address campaignAddress;
    }
    address[] private _deployedCampaigns;

    address private _creator;
    CampaignInfo[] private _campaigns;
    constructor()
    {
        _creator = msg.sender;
    }

    function createCampaign(string memory name, string memory desc, uint minAmount) external{
        address newCampaign = address(new Campaign(name, desc, minAmount, msg.sender));
        _deployedCampaigns.push(newCampaign);


        CampaignInfo memory info = CampaignInfo({
            creatorAddress: msg.sender,
            name: name,
            campaignAddress: newCampaign
        });

        _campaigns.push(info);
    }

    function getDeployedCampaigns() external view returns(address[] memory)
    {
        return _deployedCampaigns;
    }

    function getCreatorAddress() external view returns(address){
        return _creator;
    }
    function getCampaigns() external view returns(CampaignInfo[] memory){
        return _campaigns;
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

    struct Summary {
        address manager;
        string name;
        string description;
        uint minContribution;
        uint balance;
        uint contributors;
        uint totalRequests;
    }

    string private _name;
    string private _description;
    address private _manager;
    mapping(address => uint) public approvers;
    uint private _approversCount;
    uint private _minimumContribution;
    mapping(string => Request) public requests;
    uint private _requestsCount;

    constructor (string memory name, string memory description, uint minimum, address mngr)
    {
        require(minimum > 0);
        _manager = mngr;
        _name = name;
        _description = description; 
        _minimumContribution = minimum;
    }

    function getManager() external view returns (address)
    {
        return _manager;
    }

    function getCampaignName() external view returns (string memory)
    {
        return _name;
    }
    function getDescription() external view returns (string memory)
    {
        return _description;
    }
    function getContributorsCount() external view returns(uint){
        return _approversCount;
    }
    function getMinimumContribution() external view returns(uint){
        return _minimumContribution;
    }

    function getContractBalance() external view returns(uint){
        return address(this).balance;
    }
    function getRequestsCount() external view returns(uint){
        return _requestsCount;
    }
    function getSummary() external view returns(Summary memory)
    {
        Summary memory data  = Summary({
            manager: _manager,
            name: _name,
            description: _description,
            minContribution: _minimumContribution,
            balance: address(this).balance,         
            contributors: _approversCount,
            totalRequests: _requestsCount
        });

        return data;
    }

    function contribute() public payable {
        require(msg.value >= _minimumContribution); 
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

        _requestsCount++;
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