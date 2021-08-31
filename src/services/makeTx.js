const Stellar = require('stellar-sdk');
const server = new Stellar.Server("https://horizon-testnet.stellar.org");
const { TimeoutInfinite } = require("stellar-base");

export const runTransaction = (issuerAccount, recAccount, asset, amount) => {
    console.log(issuerAccount, recAccount, asset, amount)
    if (asset.issuer === undefined) {
        server.loadAccount(issuerAccount.publicKey)
            .then(async function (issuer) {
                console.log("heloooooooo", issuer)
                const fee = await server.fetchBaseFee();
                var transaction = new Stellar.TransactionBuilder(issuer, {
                    fee: fee,
                    networkPassphrase: Stellar.Networks.TESTNET,
                })
                    .addOperation(
                        Stellar.Operation.payment({
                            destination: recAccount.publicKey,
                            asset: asset,
                            amount: amount,
                        }),
                    ).setTimeout(TimeoutInfinite)
                    .build();
                transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.privateKey));
                return server.submitTransaction(transaction);
            }).catch(function (error) {
                console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
            });
    }
    else {
        server.loadAccount(recAccount.publicKey)
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
                            limit: "1000"
                        }),
                    )

                    .setTimeout(100)
                    .build();
                transaction.sign(Stellar.Keypair.fromSecret(recAccount.privateKey));
                return server.submitTransaction(transaction);
            })
            .then(console.log("halfway reached"))

            .then(function () {
                return server.loadAccount(issuerAccount.publicKey);
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
                            destination: recAccount.publicKey,
                            asset: asset,
                            amount: amount,
                        }),
                    ).setTimeout(TimeoutInfinite)
                    .build();
                transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.privateKey));
                return server.submitTransaction(transaction);
            })
            .then(console.log("asset Issued"))
            .catch(function (error) {
                console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
            });
    }



}


export const runOfferTransaction = (assetOwner, issuerAccount, recAccount, asset, amount) => {
    console.log(issuerAccount, recAccount, asset, toString(amount))
    server.loadAccount(recAccount.publicKey)
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
                        limit: "1000"
                    }),
                )

                .setTimeout(100)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(recAccount.privateKey));
            return server.submitTransaction(transaction);
        })
        .then(console.log("halfway reached"))

        .then(function () {
            return server.loadAccount(issuerAccount.publicKey);
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
                        destination: recAccount.publicKey,
                        asset: asset,
                        amount: amount,
                    }),
                ).setTimeout(TimeoutInfinite)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.privateKey));
            return server.submitTransaction(transaction);
        })
        .then(console.log("asset Issued"))
        .then(function () {
            return server.loadAccount(recAccount.publicKey);
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
                        destination: assetOwner.publicKey,
                        asset: Stellar.Asset.native(),
                        amount: amount,
                    }),
                ).setTimeout(TimeoutInfinite)
                .build();
            transaction.sign(Stellar.Keypair.fromSecret(recAccount.privateKey));
            return server.submitTransaction(transaction);
        })
        .catch(function (error) {
            console.error("Error!sdsddsdsdsfdfsdfdsdfsdfssddsdssfsdsfdsd", error);
        });



}



