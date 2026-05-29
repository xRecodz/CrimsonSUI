// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DeFi Quest Token (DFQ) — ERC-20 on Sepolia (or any EVM testnet)
/// @notice Used as in-app fee token for badge mint & staking. No custom chain required.
contract DeFiQuestToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1_000 ether;
    uint256 public constant FAUCET_COOLDOWN = 12 hours;

    mapping(address => uint256) public lastFaucetAt;

    constructor() ERC20("DeFi Quest Token", "DFQ") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 ether);
    }

    function faucet() external {
        require(
            block.timestamp >= lastFaucetAt[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown"
        );
        lastFaucetAt[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
