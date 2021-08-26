const Stellar = require('stellar-sdk');
const server = new Stellar.Server("https://horizon-testnet.stellar.org");
const { TimeoutInfinite } = require("stellar-base");

export const pathPayment = (issuerAccount, recAccount, asset, amount) => {
    console.log(issuerAccount, recAccount, asset)
    server.loadAccount(issuerAccount.publicKey)
        .then(async function (issuer) {
            console.log("heloooooooo", issuer)
            const fee = await server.fetchBaseFee();
            var transaction = new Stellar.TransactionBuilder(issuer, {
                fee: fee,
                networkPassphrase: Stellar.Networks.TESTNET,
            })
                .addOperation(
                    Stellar.Operation.pathPaymentStrictReceive({
                        destination: recAccount.publicKey,
                        sendMax: "900",
                        sendAsset: asset,
                        destAmount: amount,
                        destAsset: Stellar.Asset.native(),
                        path: []
                    }),
                ).setTimeout(TimeoutInfinite)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.privateKey));
            return server.submitTransaction(transaction);
        })
        .then(result => console.log(result))
        .catch(function (error) {
            console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
        });
}