const Stellar = require('stellar-sdk');
const server = new Stellar.Server("https://horizon-testnet.stellar.org");
const { TimeoutInfinite } = require("stellar-base");

export const jointAccount = (issuerAccount, owner, isDelete) => {
    console.log(issuerAccount, owner[0], owner.length)
    server.loadAccount(issuerAccount.public)
        .then(async function (issuer) {
            console.log(issuer)
            const fee = await server.fetchBaseFee();
            var transaction = new Stellar.TransactionBuilder(issuer, {
                fee: fee,
                networkPassphrase: Stellar.Networks.TESTNET,
            })
                .addOperation(
                    Stellar.Operation.setOptions({
                        masterWeight: "1",
                        lowThreshold: "0",
                        medThreshold: "0",
                        highThreshold: "1",
                        signer: { ed25519PublicKey: owner[0], weight: isDelete ? "0" : "1" }
                    }),
                ).setTimeout(TimeoutInfinite)
                .build();

            transaction.sign(Stellar.Keypair.fromSecret(issuerAccount.secret));
            return server.submitTransaction(transaction);
        }).then(res => console.log(res))
        .catch(e => console.log(e));
}

