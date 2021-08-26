import * as Realm from 'realm-web';
const app = new Realm.App({ id: process.env.REACT_APP_MNDB_MAIN });

export const addUser = async (userName, privateKey, publicKey) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    console.log(userName);
    const date = new Date();
    const dateFinal = date.toDateString();
    const time = date.getHours() + ":" + date.getMinutes();
    const finalTime = dateFinal + " " + time;
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const info = {
        user: userName,
        privateKey,
        publicKey,
        time: finalTime,
        type: "user"
    }
    const data = await dbcc.insertOne(info)
        .then(result => {
            console.log(`Successsssss: ${result.name}`)
        }).catch(err => console.error(`Failed to insert item: ${err}`))
}

export const addOffers = async (asset, price, seller, buyer, amount) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const date = new Date();
    const dateFinal = date.toDateString();
    const time = date.getHours() + ":" + date.getMinutes();
    const finalTime = dateFinal + " " + time;
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("offers");
    const info = {
        asset,
        price,
        seller,
        buyer,
        amount,
        time: finalTime
    }
    const data = await dbcc.insertOne(info)
        .then(result => {
            console.log(`Successsssss: ${result.name}`)
        }).catch(err => console.error(`Failed to insert item: ${err}`))
}
export const getOfferRequest = async (userName) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("offers");
    console.log(userName)
    const query = { "seller": userName }
    const data = await dbcc.find(query)
        .then(result => {
            return result
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}


export const addDistributionAccount = async (assetName, publicKey, privateKey, owner) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const date = new Date();
    const dateFinal = date.toDateString();
    const time = date.getHours() + ":" + date.getMinutes();
    const finalTime = dateFinal + " " + time;
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const info = {
        user: publicKey,
        privateKey,
        publicKey,
        assetName,
        owner,
        time: finalTime,
        type: "dist"
    }
    const data = await dbcc.insertOne(info)
        .then(result => {
            console.log(`Successsssss: ${result.name}`)
        }).catch(err => console.error(`Failed to insert item: ${err}`))
}

export const getDistributionAccount = async (assetName, ownerId) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const ownerIdString = ownerId.toString();
    const query = assetName ? {
        "assetName": assetName,
        "owner": ownerIdString
    } : {
        "owner": ownerIdString
    }
    const data = await dbcc.find(query)
        .then(result => {
            return result;
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}


export const getDistributionAccountByPublicKey = async (key) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const query = { "publicKey": key }
    const data = await dbcc.find(query)
        .then(result => {
            return result;
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}


export const getUser = async (userName) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    console.log(userName)
    const query = { "user": userName }
    const data = await dbcc.find(query)
        .then(result => {
            return result
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}

export const getUserByPublicKey = async (key) => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const query = { "publicKey": key }
    const data = await dbcc.find(query)
        .then(result => {
            return result;
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}


export const getAllUser = async () => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const query = { "type": "user" }
    const data = await dbcc.find(query)
        .then(result => {
            return result
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}

export const getAllDistributionAccount = async () => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const dbcc = mongodb.db("harshit").collection("payment");
    const query = { "type": "dist" }
    const data = await dbcc.find(query)
        .then(result => {
            return result
        }).catch(err => console.error(`Failed to insert item: ${err}`))
    return data;
}