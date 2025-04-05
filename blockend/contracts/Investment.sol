// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IEscrow
 * @dev Interface for the Escrow contract to handle fund deposits.
 */
interface IEscrow {
    function deposit(address founder, string memory projectId) external payable;
}

/**
 * @title IERC20
 * @dev Interface for the ERC-20 token standard, used for Metal Token distribution.
 */
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

/**
 * @title Investment
 * @dev Manages project creation, investor staking, phase progression, and voting for a token distribution platform.
 *      Integrates with the Escrow contract for secure fund management and distributes Metal Tokens as utility rewards.
 */
contract Investment {
    // Struct Definitions

    /**
     * @dev Represents a startup project with its metadata, phases, investor stakes, and voting data.
     */
    struct StartUpProject {
        string projectId;                   // Unique identifier for the project
        string name;                        // Name of the project
        string description;                 // Description of the project
        uint256 totalTokenCirculation;      // Total tokens available for distribution
        uint256 totalFundingGoal;           // Total ETH funding goal for the project
        uint256 amountRaised;               // Total ETH raised across all phases
        address founder;                    // Address of the project founder
        ProjectPhase[] projectPhases;       // Array of funding phases
        bool isActive;                      // Indicates if the project is active
        mapping(address => uint256) investorStakes; // ETH staked by each investor
        uint256 currentPhase;               // Index of the current active phase
        bool allPhasesCompleted;            // Flag indicating if all phases are completed
        mapping(address => bool) phaseVotes; // Tracks investor votes for current phase
        uint256 totalVotesForPhase;         // Total ETH staked by voters in favor
        uint256 totalStakedETH;             // Total ETH staked in project
    }

    /**
     * @dev Represents a single funding phase within a project, including voting details.
     */
    struct ProjectPhase {
        string phaseName;                   // Name of the phase (e.g., "Phase 1")
        uint256 phaseFundingGoal;           // ETH funding goal for this phase
        uint256 amountRaised;               // ETH raised in this phase
        bool isActive;                      // Indicates if the phase is currently active
        uint256 deadline;                   // Timestamp when the phase ends
        bool tasksCompleted;                // Flag indicating if tasks for this phase are completed
        bool votingActive;                  // Indicates if voting is active for this phase
        uint256 votingDeadline;             // Deadline for voting
    }

    // State Variables

    IEscrow public escrow;                  // Address of the Escrow contract
    IERC20 public metalToken;               // Metal Token contract for utility rewards
    mapping(address => StartUpProject[]) public projectsByFounder; // Maps founders to their projects
    uint256 public constant VOTING_DURATION = 3 days; // Voting period for phase validation
    uint256 public constant METAL_TOKEN_REWARD_PER_ETH = 100; // 100 Metal Tokens per ETH staked

    // Events

    /**
     * @dev Emitted when a new project is created.
     * @param projectId Unique identifier of the project.
     * @param founder Address of the project founder.
     * @param totalTokenCirculation Total tokens to be distributed.
     */
    event ProjectCreated(string projectId, address founder, uint256 totalTokenCirculation);

    /**
     * @dev Emitted when a phase is completed after successful voting.
     * @param projectId Unique identifier of the project.
     * @param phaseIndex Index of the completed phase.
     * @param amountRaised ETH raised in the phase.
     */
    event PhaseCompleted(string projectId, uint256 phaseIndex, uint256 amountRaised);

    /**
     * @dev Emitted when an investor stakes ETH in a project.
     * @param projectId Unique identifier of the project.
     * @param investor Address of the investor.
     * @param amount Amount of ETH staked.
     */
    event Staked(string projectId, address investor, uint256 amount);

    /**
     * @dev Emitted when ETH is sent to the Escrow contract.
     * @param projectId Unique identifier of the project.
     * @param amount Amount of ETH sent.
     */
    event ETHSentToEscrow(string projectId, uint256 amount);

    /**
     * @dev Emitted when an investor votes on phase validation.
     * @param projectId Unique identifier of the project.
     * @param investor Address of the investor.
     * @param vote True if voting in favor, false otherwise.
     * @param stake Amount of ETH staked by the investor.
     */
    event Voted(string projectId, address investor, bool vote, uint256 stake);

    /**
     * @dev Emitted when voting starts for a phase.
     * @param projectId Unique identifier of the project.
     * @param phaseIndex Index of the phase.
     * @param votingDeadline Timestamp when voting ends.
     */
    event VotingStarted(string projectId, uint256 phaseIndex, uint256 votingDeadline);

    /**
     * @dev Emitted when Metal Tokens are distributed to an investor.
     * @param projectId Unique identifier of the project.
     * @param investor Address of the investor.
     * @param amount Amount of Metal Tokens distributed.
     */
    event MetalTokensDistributed(string projectId, address investor, uint256 amount);

    /**
     * @dev Constructor to initialize the Investment contract.
     * @param _escrow Address of the deployed Escrow contract.
     * @param _metalToken Address of the Metal Token ERC-20 contract.
     */
    constructor(IEscrow _escrow, IERC20 _metalToken) {
        escrow = _escrow;
        metalToken = _metalToken;
    }

    /**
     * @dev Creates a new startup project with specified phases.
     * @param projectId Unique identifier for the project.
     * @param _name Name of the project.
     * @param _description Description of the project.
     * @param _totalTokenCirculation Total tokens to be distributed.
     * @param _phaseFundingGoals Array of ETH funding goals for each phase.
     * @param _phaseDeadlines Array of deadlines (timestamps) for each phase.
     * @param _totalFundingGoal Total ETH funding goal for the project.
     */
    function createProject(
        string memory projectId,
        string memory _name,
        string memory _description,
        uint256 _totalTokenCirculation,
        uint256[] memory _phaseFundingGoals,
        uint256[] memory _phaseDeadlines,
        uint256 _totalFundingGoal
    ) public {
        require(_phaseFundingGoals.length == _phaseDeadlines.length, "Mismatched phase data");
        require(_phaseFundingGoals.length > 0, "At least one phase required");

        StartUpProject storage newProject = projectsByFounder[msg.sender].push();
        newProject.projectId = projectId;
        newProject.name = _name;
        newProject.description = _description;
        newProject.totalTokenCirculation = _totalTokenCirculation;
        newProject.amountRaised = 0;
        newProject.founder = msg.sender;
        newProject.isActive = true;
        newProject.currentPhase = 0;
        newProject.allPhasesCompleted = false;
        newProject.totalFundingGoal = _totalFundingGoal;
        newProject.totalStakedETH = 0;

        for (uint256 i = 0; i < _phaseFundingGoals.length; i++) {
            newProject.projectPhases.push(
                ProjectPhase({
                    phaseName: string(abi.encodePacked("Phase ", uint2str(i + 1))),
                    phaseFundingGoal: _phaseFundingGoals[i],
                    amountRaised: 0,
                    isActive: i == 0,
                    deadline: _phaseDeadlines[i],
                    tasksCompleted: false,
                    votingActive: false,
                    votingDeadline: 0
                })
            );
        }

        emit ProjectCreated(projectId, msg.sender, _totalTokenCirculation);
    }

    /**
     * @dev Internal helper function to find a project by its ID within a founder's projects.
     * @param projects Array of projects to search through.
     * @param projectId ID of the project to find.
     * @return StartUpProject storage reference to the found project.
     */
    function findProject(
        StartUpProject[] storage projects,
        string memory projectId
    ) internal view returns (StartUpProject storage) {
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].projectId)) == keccak256(abi.encodePacked(projectId))) {
                return projects[i];
            }
        }
        revert("Project not found");
    }

    /**
     * @dev Internal helper function to convert a uint to a string for phase naming.
     * @param _i The number to convert.
     * @return string representation of the number.
     */
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        return string(bstr);
    }

    /**
     * @dev Retrieves project details by founder and project ID for external contracts.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return projectId, name, description, totalTokenCirculation, amountRaised, founder, isActive, currentPhase, allPhasesCompleted, totalFundingGoal
     */
    function getProject(
        address founder,
        string memory projectId
    ) public view returns (
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        address,
        bool,
        uint256,
        bool,
        uint256
    ) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        return (
            project.projectId,
            project.name,
            project.description,
            project.totalTokenCirculation,
            project.amountRaised,
            project.founder,
            project.isActive,
            project.currentPhase,
            project.allPhasesCompleted,
            project.totalFundingGoal
        );
    }

    /**
     * @dev Retrieves the amount of ETH staked by an investor in a project.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @param investor Address of the investor.
     * @return uint256 Amount of ETH staked by the investor.
     */
    function findInvestor(address founder, string memory projectId, address investor) public view returns (uint256) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        return project.investorStakes[investor];
    }

    /**
     * @dev Allows an investor to stake ETH in a project, sending funds to Escrow and distributing Metal Tokens.
     * @param founder Address of the project founder.
     * @param projectId ID of the project to stake in.
     */
    function stake(address founder, string memory projectId) public payable {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        require(currentPhase.isActive, "Current phase is not active");
        require(block.timestamp <= currentPhase.deadline, "Phase deadline passed");

        project.investorStakes[msg.sender] += msg.value;
        project.amountRaised += msg.value;
        project.totalStakedETH += msg.value;
        currentPhase.amountRaised += msg.value;

        // Distribute Metal Tokens as a staking reward
        uint256 metalReward = msg.value * METAL_TOKEN_REWARD_PER_ETH;
        require(metalToken.transfer(msg.sender, metalReward), "Metal Token transfer failed");
        emit MetalTokensDistributed(projectId, msg.sender, metalReward);

        escrow.deposit{value: msg.value}(founder, projectId);

        emit Staked(projectId, msg.sender, msg.value);
        emit ETHSentToEscrow(projectId, msg.value);
    }

    /**
     * @dev Checks if the funding goal for the current phase has been reached.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return bool True if the goal is reached, false otherwise.
     */
    function checkGoalReached(address founder, string memory projectId) public view returns (bool) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        return currentPhase.amountRaised >= currentPhase.phaseFundingGoal;
    }

    /**
     * @dev Starts the voting process for phase validation, initiated by the founder.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     */
    function startPhaseVoting(address founder, string memory projectId) public {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(msg.sender == project.founder, "Only founder can start voting");
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        require(currentPhase.isActive, "Current phase is not active");
        require(checkGoalReached(founder, projectId), "Funding goal not reached");
        require(!currentPhase.votingActive, "Voting already active");

        currentPhase.votingActive = true;
        currentPhase.votingDeadline = block.timestamp + VOTING_DURATION;
        project.totalVotesForPhase = 0;

        emit VotingStarted(projectId, project.currentPhase, currentPhase.votingDeadline);
    }

    /**
     * @dev Allows investors to vote on phase validation, weighted by their staked ETH.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @param voteInFavor True if voting in favor, false otherwise.
     */
    function voteOnPhase(address founder, string memory projectId, bool voteInFavor) public {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        require(currentPhase.votingActive, "Voting not active");
        require(block.timestamp <= currentPhase.votingDeadline, "Voting period ended");
        require(project.investorStakes[msg.sender] > 0, "Not an investor");

        require(!project.phaseVotes[msg.sender], "Already voted");
        project.phaseVotes[msg.sender] = true;

        if (voteInFavor) {
            project.totalVotesForPhase += project.investorStakes[msg.sender];
        }

        emit Voted(projectId, msg.sender, voteInFavor, project.investorStakes[msg.sender]);
    }

    /**
     * @dev Validates the current phase based on voting results, progressing to the next phase if approved.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return bool True if the phase is still active, false if expired or completed.
     */
    function validatePhase(address founder, string memory projectId) public returns (bool) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        require(currentPhase.votingActive, "Voting not active");

        if (block.timestamp > currentPhase.deadline) {
            currentPhase.isActive = false;
            project.isActive = false;
            return false;
        }

        if (block.timestamp > currentPhase.votingDeadline) {
            if (project.totalVotesForPhase * 2 >= project.totalStakedETH) {
                currentPhase.isActive = false;
                currentPhase.tasksCompleted = true;
                if (project.currentPhase + 1 < project.projectPhases.length) {
                    project.currentPhase += 1;
                    project.projectPhases[project.currentPhase].isActive = true;
                } else {
                    project.allPhasesCompleted = true;
                }
                emit PhaseCompleted(projectId, project.currentPhase, currentPhase.amountRaised);
            } else {
                currentPhase.votingActive = false;
            }
            project.totalVotesForPhase = 0;
        }

        return currentPhase.isActive;
    }
}