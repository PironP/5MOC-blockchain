const CryptoTrader = artifacts.require('CryptoTrader');

const computeGasCost = async (web3, txInfo) => {
    const tx = await web3.eth.getTransaction(txInfo.tx);
    return tx.gasPrice * txInfo.receipt.gasUsed;
};

contract('CryptoTrader', (accounts) => {
    const [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await CryptoTrader.new();
    });

    it('should be able to join a competition', async () => {
        const originalBalance = await web3.eth.getBalance(alice);

        const txInfo = await contractInstance.joinCompetition(2, { from: alice, value: web3.utils.toWei('0.001') });
        const newBalance = await web3.eth.getBalance(alice);

        assert.equal(txInfo.receipt.status, true);
        assert.equal(originalBalance, parseInt(newBalance) + parseInt(web3.utils.toWei('0.001')) + await computeGasCost(web3, txInfo));
    });

    it('should be able to leave a competition', async () => {
        const originalBalance = await web3.eth.getBalance(bob);

        const txInfoJoin = await contractInstance.joinCompetition(2, { from: bob, value: web3.utils.toWei('0.001') });
        const txInfoLeave = await contractInstance.leaveCompetition(2, { from: bob });
        const newBalance = await web3.eth.getBalance(bob);

        assert.equal(txInfoJoin.receipt.status, true);
        assert.equal(txInfoLeave.receipt.status, true);
        assert.equal(originalBalance, parseInt(newBalance) + await computeGasCost(web3, txInfoJoin) + await computeGasCost(web3, txInfoLeave));
    });

    it('should get the token price', async () => {
        const result = await contractInstance.getPrice();
        assert.typeOf(result.words[0], 'number');
    });
});
