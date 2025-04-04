// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Escrow
 * @dev Securely holds ETH funds for projects, allowing deposits, releases, and refunds.
 *      Interacts with the Investment and Distribution contracts.
 */
contract Escrow {
    // State Variables

    mapping(address => mapping(string => uint256)) public projectFunds; // Funds held per project per founder
    mapping(address => mapping(string => mapping(address => uint256))) public investorContributions; // Contributions per investor per project

    // Events

    event Deposited(address indexed founder, string projectId, address investor, uint256 amount);
    event Released(address indexed founder, string projectId, address recipient, uint256 amount);
    event Refunded(address indexed founder, string projectId, address investor, uint256 amount);

    /**
     * @dev Deposits ETH into escrow for a specific project.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     */
    function deposit(address founder, string memory projectId) external payable {
        require(msg.value > 0, "No ETH sent");
        projectFunds[founder][projectId] += msg.value;
        investorContributions[founder][projectId][msg.sender] += msg.value;
        emit Deposited(founder, projectId, msg.sender, msg.value);
    }

    /**
     * @dev Releases funds to a recipient (e.g., founder) after project completion.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @param recipient Address to receive the funds.
     */
    function release(address founder, string memory projectId, address recipient) external {
        uint256 amount = projectFunds[founder][projectId];
        require(amount > 0, "No funds to release");

        projectFunds[founder][projectId] = 0;
        payable(recipient).transfer(amount);
        emit Released(founder, projectId, recipient, amount);
    }

    /**
     * @dev Refunds an investor their contribution if a phase fails.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @param investor Address of the investor to refund.
     */
    function refund(address founder, string memory projectId, address investor) external {
        uint256 amount = investorContributions[founder][projectId][investor];
        require(amount > 0, "No funds to refund");

        investorContributions[founder][projectId][investor] = 0;
        projectFunds[founder][projectId] -= amount;
        payable(investor).transfer(amount);
        emit Refunded(founder, projectId, investor, amount);
    }

    /**
     * @dev Retrieves the total funds held for a project.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return uint256 Total ETH held in escrow for the project.
     */
    function getProjectFunds(address founder, string memory projectId) external view returns (uint256) {
        return projectFunds[founder][projectId];
    }

    /**
     * @dev Retrieves an investor's contribution to a project.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @param investor Address of the investor.
     * @return uint256 Amount of ETH contributed by the investor.
     */
    function getInvestorContribution(
        address founder,
        string memory projectId,
        address investor
    ) external view returns (uint256) {
        return investorContributions[founder][projectId][investor];
    }
}