const Stellar = require('stellar-sdk');

const server = new Stellar.Server("https://horizon-testnet.stellar.org");


export const checkedAccounts = async key => {
    console.log(key)
    const detail = await server.loadAccount(key);
    console.log(detail)
    const { id, balances } = detail;
    return {
        id,
        balances
    };
};


