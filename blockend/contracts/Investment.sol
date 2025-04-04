// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEscrow {
    function deposit(address founder, string memory projectId) external payable;
}

contract Investment {
    // Struct for a startup project
    struct StartUpProject {
        string projectId;
        string name;
        string description;
        uint256 totalTokenCirculation; // Total tokens to distribute
        uint256 amountRaised; // Total ETH staked by investors
        address founder; // Founder of the project
        ProjectPhase[] projectPhases; // Array of phases
        bool isActive; // Whether the project is active
        mapping(address => uint256) investorStakes; // ETH staked by each investor
        uint256 currentPhase; // Tracks the current phase index
        bool allPhasesCompleted; // Flag to check if all phases are done
    }

    // Struct for a project phase
    struct ProjectPhase {
        string phaseName;
        uint256 phaseFundingGoal; // ETH goal for this phase
        uint256 amountRaised; // ETH raised in this phase
        bool isActive; // Whether the phase is active
        uint256 deadline; // Deadline for the phase (timestamp)
        bool tasksCompleted; // Placeholder for task completion
    }

    // Escrow contract address
    IEscrow public escrow;

    // Mapping of projects by founder
    mapping(address => StartUpProject[]) public projectsByFounder;

    // Events
    event ProjectCreated(string projectId, address founder, uint256 totalTokenCirculation);
    event PhaseCompleted(string projectId, uint256 phaseIndex, uint256 amountRaised);
    event Staked(string projectId, address investor, uint256 amount);
    event ETHSentToEscrow(string projectId, uint256 amount);

    // Constructor
    constructor(IEscrow _escrow) {
        escrow = _escrow;
    }

    // Create a new project
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

    // Helper function to find a project by ID
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

    // Helper function to convert uint to string
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

    // Find an investor's stake
    function findInvestor(address founder, string memory projectId, address investor) public view returns (uint256) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        return project.investorStakes[investor];
    }

    // Perform investment (stake ETH and send to escrow)
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

        // Send ETH to escrow
        escrow.deposit{value: msg.value}(founder, projectId);

        emit Staked(projectId, msg.sender, msg.value);
        emit ETHSentToEscrow(projectId, msg.value);
    }

    // Check if the funding goal is reached
    function checkGoalReached(address founder, string memory projectId) public view returns (bool) {
        StartUpProject storage project = findProject(projectsByFounder[founder], projectId);
        ProjectPhase storage currentPhase = project.projectPhases[project.currentPhase];
        return currentPhase.amountRaised >= currentPhase.phaseFundingGoal;
    }

    // Validate the current phase
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
            } else {
                project.allPhasesCompleted = true;
            }
            emit PhaseCompleted(projectId, project.currentPhase, currentPhase.amountRaised);
        }

        return currentPhase.isActive;
    }

    // Check task completion (placeholder)
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