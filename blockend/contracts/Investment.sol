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
 * @title Investment
 * @dev Manages project creation, investor staking, and phase progression for a token distribution platform.
 *      Interacts with the Escrow contract to securely hold investor funds.
 */
contract Investment {
    // Struct Definitions

    /**
     * @dev Represents a startup project with its metadata, phases, and investor stakes.
     */
    struct StartUpProject {
        string projectId;                   // Unique identifier for the project
        string name;                        // Name of the project
        string description;                 // Description of the project
        uint256 totalTokenCirculation;      // Total tokens available for distribution
        uint256 amountRaised;               // Total ETH raised across all phases
        address founder;                    // Address of the project founder
        ProjectPhase[] projectPhases;       // Array of funding phases
        bool isActive;                      // Indicates if the project is active
        mapping(address => uint256) investorStakes; // ETH staked by each investor
        uint256 currentPhase;               // Index of the current active phase
        bool allPhasesCompleted;            // Flag indicating if all phases are completed
    }

    /**
     * @dev Represents a single funding phase within a project.
     */
    struct ProjectPhase {
        string phaseName;                   // Name of the phase (e.g., "Phase 1")
        uint256 phaseFundingGoal;           // ETH funding goal for this phase
        uint256 amountRaised;               // ETH raised in this phase
        bool isActive;                      // Indicates if the phase is currently active
        uint256 deadline;                   // Timestamp when the phase ends
        bool tasksCompleted;                // Flag indicating if tasks for this phase are completed
    }

    // State Variables

    IEscrow public escrow;                  // Address of the Escrow contract
    mapping(address => StartUpProject[]) public projectsByFounder; // Maps founders to their projects

    // Events

    event ProjectCreated(string projectId, address founder, uint256 totalTokenCirculation);
    event PhaseCompleted(string projectId, uint256 phaseIndex, uint256 amountRaised);
    event Staked(string projectId, address investor, uint256 amount);
    event ETHSentToEscrow(string projectId, uint256 amount);

    /**
     * @dev Constructor to initialize the Investment contract with the Escrow contract address.
     * @param _escrow Address of the deployed Escrow contract.
     */
    constructor(IEscrow _escrow) {
        escrow = _escrow;
    }

    /**
     * @dev Creates a new startup project with specified phases.
     * @param projectId Unique identifier for the project.
     * @param _name Name of the project.
     * @param _description Description of the project.
     * @param _totalTokenCirculation Total tokens to be distributed.
     * @param _phaseFundingGoals Array of ETH funding goals for each phase.
     * @param _phaseDeadlines Array of deadlines (timestamps) for each phase.
     */
    function createProject(
        string memory projectId,
        string memory _name,
        string memory _description,
        uint256 _totalTokenCirculation,
        uint256[] memory _phaseFundingGoals,
        uint256[] memory _phaseDeadlines
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

        for (uint256 i = 0; i < _phaseFundingGoals.length; i++) {
            newProject.projectPhases.push(
                ProjectPhase({
                    phaseName: string(abi.encodePacked("Phase ", uint2str(i + 1))),
                    phaseFundingGoal: _phaseFundingGoals[i],
                    amountRaised: 0,
                    isActive: i == 0,
                    deadline: _phaseDeadlines[i],
                    tasksCompleted: false
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
     * @dev Public function to find a project by founder and project ID, exposing internal logic for external contracts.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return projectId, name, description, totalTokenCirculation, amountRaised, founder, isActive, currentPhase, allPhasesCompleted
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
        bool
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
            project.allPhasesCompleted
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
     * @dev Allows an investor to stake ETH in a project, sending funds to the Escrow contract.
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
        currentPhase.amountRaised += msg.value;

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
     * @dev Validates the current phase, progressing to the next phase if the goal is reached.
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return bool True if the phase is still active, false if expired or completed.
     */
    function validatePhase(address founder, string memory projectId) public returns (bool) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];

        if (block.timestamp > currentPhase.deadline) {
            currentPhase.isActive = false;
            project.isActive = false;
            return false;
        }

        if (checkGoalReached(founder, projectId)) {
            currentPhase.isActive = false;
            if (project.currentPhase + 1 < project.projectPhases.length) {
                project.currentPhase += 1;
                project.projectPhases[project.currentPhase].isActive = true;
                emit PhaseCompleted(projectId, project.currentPhase, currentPhase.amountRaised);
            } else {
                project.allPhasesCompleted = true;
            }
            emit PhaseCompleted(projectId, project.currentPhase, currentPhase.amountRaised);
        }

        return currentPhase.isActive;
    }

    /**
     * @dev Marks tasks as completed for the current phase (placeholder).
     * @param founder Address of the project founder.
     * @param projectId ID of the project.
     * @return bool True if tasks are marked as completed.
     */
    function checkTaskCompletion(address founder, string memory projectId) public returns (bool) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        require(project.isActive, "Project is not active");
        require(!project.allPhasesCompleted, "All phases completed");
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        require(currentPhase.isActive, "Current phase is not active");
        require(msg.sender == project.founder, "Only founder can mark tasks as completed");

        currentPhase.tasksCompleted = true;
        return true;
    }
}