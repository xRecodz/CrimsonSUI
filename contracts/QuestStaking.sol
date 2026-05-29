// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Locks DFQ for bonus quest completion (withdraw anytime).
contract QuestStaking is Ownable {
    IERC20 public immutable dfqToken;
    uint256 public minStake;

    mapping(address => uint256) public stakedBalance;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address dfqToken_, uint256 minStake_) Ownable(msg.sender) {
        dfqToken = IERC20(dfqToken_);
        minStake = minStake_;
    }

    function setMinStake(uint256 newMin) external onlyOwner {
        minStake = newMin;
    }

    function stake(uint256 amount) external {
        require(amount >= minStake, "Below min stake");
        require(dfqToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        stakedBalance[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(stakedBalance[msg.sender] >= amount, "Insufficient stake");
        stakedBalance[msg.sender] -= amount;
        require(dfqToken.transfer(msg.sender, amount), "Transfer failed");
        emit Unstaked(msg.sender, amount);
    }
}
