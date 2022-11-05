// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract AMM {
    // ERC20を実装したコントラクト
    IERC20 tokenX; 
    IERC20 tokenY; 

    // シェアの総量
    uint256 public totalShare; 

    // 各ユーザのシェア
    mapping(address => uint256) public share; 
    // プールにロックされた各トークンの量
    mapping(IERC20 => uint256) public totalAmount; 

    // シェアの精度に使用する定数(= 6桁)
    uint256 public constant PRECISION = 1_000_000; 

    modifier activePool() {
        require(totalShare > 0, "Zero Liquidity");
        _;
    }

    modifier validToken(IERC20 _token) {
        require(
            _token == tokenX || _token == tokenY,
            "Token is not in the pool"
        );
        _;
    }

    modifier validTokens(IERC20 _tokenX, IERC20 _tokenY) {
        require(
            _tokenX == tokenX || _tokenY == tokenY,
            "Token is not in the pool"
        );
        require(
            _tokenY == tokenX || _tokenY == tokenY,
            "Token is not in the pool"
        );
        require(_tokenX != _tokenY, "Tokens should be different!");
        _;
    }

    constructor(IERC20 _tokenX, IERC20 _tokenY) {
        tokenX = _tokenX;
        tokenY = _tokenY;
    }

    /**
     * get token X Contract
     */
    function pairToken(IERC20 token)
        private
        view
        validToken(token)
        returns (IERC20)
    {
        if (token == tokenX) {
            return tokenY;
        }
        return tokenX;
    }

    /**
     * get equivalent token function
     */
    function getEquivalentToken(IERC20 _inToken, uint256 _amountIn)
        public
        view
        activePool
        validToken(_inToken)
        returns (uint256)
    {
        IERC20 outToken = pairToken(_inToken);

        return (totalAmount[outToken] * _amountIn) / totalAmount[_inToken];
    }

    /**
     * provide function 
     */
    function provide(
        IERC20 _tokenX,
        uint256 _amountX,
        IERC20 _tokenY,
        uint256 _amountY
    ) external validTokens(_tokenX, _tokenY) returns (uint256) {
        require(_amountX > 0, "Amount cannot be zero!");
        require(_amountY > 0, "Amount cannot be zero!");

        uint256 newshare;

        if (totalShare == 0) {
            newshare = 100 * PRECISION;
        } else {
            uint256 shareX = (totalShare * _amountX) / totalAmount[_tokenX];
            uint256 shareY = (totalShare * _amountY) / totalAmount[_tokenY];
            require(
                shareX == shareY,
                "Equivalent value of tokens not provided..."
            );
            newshare = shareX;
        }

        require(
            newshare > 0,
            "Asset value less than threshold for contribution!"
        );

        // transfer to this contract
        _tokenX.transferFrom(msg.sender, address(this), _amountX);
        _tokenY.transferFrom(msg.sender, address(this), _amountY);

        totalAmount[_tokenX] += _amountX;
        totalAmount[_tokenY] += _amountY;

        totalShare += newshare;
        share[msg.sender] += newshare;

        return newshare;
    }
}