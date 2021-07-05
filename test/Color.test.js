const { assert } = require('chai');

const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
    let contract;

    before(async () => {
        contract = await Color.deployed();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        });

        it('has a symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'COLOR');
        });
    });

    describe('minting', async() => {
        it('creates a new token', async() => {
            const result = await contract.mint('#FFFFFF');       
            const totalSupply = await contract.totalSupply(); 
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 0, 'id is correct');
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
            assert.equal(event.to, accounts[0], 'to is correct');
            // assert.equal(event.tokenId.toNumber(), 1);
            // console.log(result);

            await contract.mint('#FFFFFF').should.be.rejected;       
        });
    });

    describe('indexing', async() => {
        it('lists colors', async () => {
            await contract.mint('#5386E4'); 
            await contract.mint('#000000'); 
            await contract.mint('#EC058E'); 
            const totalSupply = await contract.totalSupply();
            let color;
            let result = [];
            for (let i=0; i < totalSupply; ++i){
                color = await contract.colors(i);
                result.push(color);
            }
            let expected = ['#FFFFFF','#5386E4', '#000000', '#EC058E'];
            assert.equal(result.join(','), expected.join(','), 'index works fine');
        });
    });
    
});