// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IERC20
 * @dev Interface for the ERC-20 token standard used for project token distribution.
 */
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

/**
 * @title IInvestment
 * @dev Interface for the Investment contract to access project data.
 */
interface IInvestment {
    function getProject(
        address projectFounder,
        string memory projectId
    ) external view returns (
        string memory returnedProjectId,
        string memory name,
        string memory description,
        uint256 totalTokenCirculation,
        uint256 amountRaised,
        address founder,
        bool isActive,
        uint256 currentPhase,
        bool allPhasesCompleted,
        uint256 totalFundingGoal
    );
    function findInvestor(address founder, string memory projectId, address investor) external view returns (uint256);
}

/**
 * @title IEscrow
 * @dev Interface for the Escrow contract to release funds.
 */
interface IEscrow {
    function release(address founder, string memory projectId, address recipient) external;
}

/**
 * @title Distribution
 * @dev Handles token distribution to founders, the platform, and investors after project completion.
 *      Interacts with the Investment contract for project data and the Escrow contract for fund release.
 */
contract Distribution {
    // State Variables

    IERC20 public token;                // ERC-20 token contract for project token distribution
    address public platformAddress;     // Address receiving platform tokens
    IInvestment public investment;      // Address of the Investment contract
    IEscrow public escrow;              // Address of the Escrow contract

    uint256 public constant FOUNDER_PERCENTAGE = 40;    // 40% of tokens to founders
    uint256 public constant PLATFORM_PERCENTAGE = 10;   // 10% of tokens to platform
    uint256 public constant INVESTOR_PERCENTAGE = 50;   // 50% of tokens to investors

    // Events

    /**
     * @dev Emitted when tokens are distributed to a recipient.
     * @param projectId Unique identifier of the project.
     * @param recipient Address receiving the tokens.
     * @param amount Amount of tokens distributed.
     */
    event TokensDistributed(string projectId, address recipient, uint256 amount);

    /**
     * @dev Emitted when rewards are distributed to an investor.
     * @param projectId Unique identifier of the project.
     * @param investor Address of the investor.
     * @param reward Amount of tokens rewarded.
     */
    event RewardsDistributed(string projectId, address investor, uint256 reward);

    /**
     * @dev Constructor to initialize the Distribution contract.
     * @param _token Address of the ERC-20 token contract for project tokens.
     * @param _platformAddress Address receiving platform tokens.
     * @param _investment Address of the Investment contract.
     * @param _escrow Address of the Escrow contract.
     */
    constructor(IERC20 _token, address _platformAddress, IInvestment _investment, IEscrow _escrow) {
        token = _token;
        platformAddress = _platformAddress;
        investment = _investment;
        escrow = _escrow;
    }

    /**
     * @dev Distributes project tokens to the founder, platform, and investors, and releases funds from Escrow.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     */
    function confirmDistribution(address founder, string memory projectId) public {
        // Fetch project details from Investment contract
        (
            ,
            ,
            ,
            uint256 totalTokenCirculation,
            uint256 amountRaised,
            address projectFounder,
            bool isActive,
            ,
            bool allPhasesCompleted,
            uint256 totalFundingGoal
        ) = investment.getProject(founder, projectId);

        require(allPhasesCompleted, "Not all phases completed");
        require(isActive, "Project is not active");

        uint256 totalTokens = totalTokenCirculation;

        // Distribute to founder (40%)
        uint256 founderTokens = (totalTokens * FOUNDER_PERCENTAGE) / 100;
        require(token.transfer(projectFounder, founderTokens), "Founder token transfer failed");
        emit TokensDistributed(projectId, projectFounder, founderTokens);

        // Distribute to platform (10%)
        uint256 platformTokens = (totalTokens * PLATFORM_PERCENTAGE) / 100;
        require(token.transfer(platformAddress, platformTokens), "Platform token transfer failed");
        emit TokensDistributed(projectId, platformAddress, platformTokens);

        // Distribute to investors (50%)
        uint256 investorTokens = (totalTokens * INVESTOR_PERCENTAGE) / 100;
        uint256 totalStaked = amountRaised;

        // Release funds from escrow to founder
        escrow.release(founder, projectId, projectFounder);

        // Simplified investor distribution
        uint256 investorStake = investment.findInvestor(founder, projectId, msg.sender);
        if (investorStake > 0) {
            uint256 investorReward = (investorTokens * investorStake) / totalStaked;
            require(token.transfer(msg.sender, investorReward), "Investor token transfer failed");
            emit RewardsDistributed(projectId, msg.sender, investorReward);
        }
    }
}