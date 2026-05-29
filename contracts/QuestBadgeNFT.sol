// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Weekly badge NFT — mint costs DFQ tokens (treasury or burn address).
contract QuestBadgeNFT is ERC721URIStorage, Ownable {
    IERC20 public immutable dfqToken;
    address public treasury;
    uint256 public mintFee;
    uint256 private _nextTokenId;

    event BadgeMinted(address indexed user, uint256 tokenId, string tokenURI, uint256 feePaid);

    constructor(
        address dfqToken_,
        address treasury_,
        uint256 mintFee_
    ) ERC721("DeFi Quest Pioneer", "DFQB") Ownable(msg.sender) {
        dfqToken = IERC20(dfqToken_);
        treasury = treasury_;
        mintFee = mintFee_;
    }

    function setMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        treasury = newTreasury;
    }

    /// @param tokenURI IPFS URI e.g. ipfs://Qm...
    function mintBadge(string calldata tokenURI) external returns (uint256 tokenId) {
        require(
            dfqToken.transferFrom(msg.sender, treasury, mintFee),
            "DFQ fee transfer failed"
        );

        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit BadgeMinted(msg.sender, tokenId, tokenURI, mintFee);
    }
}
