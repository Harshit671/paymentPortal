var Stellar = require("stellar-sdk");
var server = new Stellar.Server("https://horizon-testnet.stellar.org");


//var astroDollar = new Stellar.Asset("AstroDollar", Alice.publicKey);

export const issueAccount = (issuerAccount, recAccount, asset, value) => {
    console.log(issuerAccount, recAccount, asset)
    server.loadAccount(recAccount.public)
        .then(async function (receiver) {
            console.log(receiver)
            const fee = await server.fetchBaseFee();
            var transaction = new Stellar.TransactionBuilder(receiver, {
                fee: fee,
                networkPassphrase: Stellar.Networks.TESTNET,
            })
                .addOperation(
                    Stellar.Operation.changeTrust({
                        asset: asset,
                        limit: "2000"
                    }),
                )

                .setTimeout(100)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(recAccount.secret));
            return server.submitTransaction(transaction);
        })
        .then(console.log("halfway reached"))

        .then(function () {
            return server.loadAccount(issuerAccount.public);
        })
        .then(async function (issuer) {
            console.log("heloooooooo", issuer)
            const fee = await server.fetchBaseFee();
            var transaction = new Stellar.TransactionBuilder(issuer, {
                fee: fee,
                networkPassphrase: Stellar.Networks.TESTNET,
            })
                .addOperation(
                    Stellar.Operation.payment({
                        destination: recAccount.public,
                        asset: asset,
                        amount: value,
                    }),
                ).setTimeout(100)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.secret));
            return server.submitTransaction(transaction);
        })
        .then(console.log("asset Issued"))
        .catch(function (error) {
            console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
        });



}