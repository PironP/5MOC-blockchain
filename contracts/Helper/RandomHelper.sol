pragma solidity >=0.4.21 <0.7.0;

contract RandomHelper {
    // pseudo-random number between 0 and 1000 using keccak256 hash
    function _random() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(now))) % 1001;
    }
}
