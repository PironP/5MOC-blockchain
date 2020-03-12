pragma solidity >=0.4.21 <0.7.0;

contract ArrayHelper {
    function _removeAtIndex(address[] storage array, uint index) internal {
        if (index >= array.length) return;

        for (uint i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }

        delete array[array.length - 1];
    }

    function _findIndexOf(address[] memory array, address value) internal pure returns (uint) {
        for (uint i = 0; i < array.length; i++) {
            if (value == array[i]) {
                return i;
            }
        }
    }
}
