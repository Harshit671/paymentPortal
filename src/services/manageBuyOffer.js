const Stellar = require('stellar-sdk');
const server = new Stellar.Server("https://horizon-testnet.stellar.org");
const { TimeoutInfinite } = require("stellar-base");

export const manageBuyOffer = (issuerAccount, asset, amount, offerId, isDelete) => {
    console.log(issuerAccount, asset)
    server.loadAccount(issuerAccount.publicKey)
        .then(async function (issuer) {
            console.log("heloooooooo", issuer)
            const fee = await server.fetchBaseFee();
            var transaction = new Stellar.TransactionBuilder(issuer, {
                fee: fee,
                networkPassphrase: Stellar.Networks.TESTNET,
            })
                .addOperation(
                    Stellar.Operation.manageBuyOffer({
                        selling: asset,
                        buying: Stellar.Asset.native(),
                        buyAmount: amount,
                        price: { n: 50, d: 30 },
                        offerId: isDelete ? offerId : 0
                    }),
                ).setTimeout(TimeoutInfinite)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.privateKey));
            return server.submitTransaction(transaction);
        }).then(result => {
            console.log(result)
            return result
        })
        .catch(function (error) {
            console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
        });

}



