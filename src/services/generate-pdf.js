import { NFTStorage, Blob, File } from 'nft.storage'
import { jsPDF } from "jspdf";

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg4Qzc5ZkRhOWI5MEY2NkEyOWJkMjQwN2E0RUUzRTZGN2Y1NDgyQzEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTkxMzgzMDQ4NSwibmFtZSI6ImhhcnNoaXQifQ.GZxXR3bCp2TSn8rCeSESOKLqyGo9YfsXv2sqIkHUNn0'


export const printFile = (id, user, value) => {
    const doc = new jsPDF();

    const date = new Date();
    const dateFinal = date.toDateString();
    const time = date.getHours() + ":" + date.getMinutes();
    const finalTime = dateFinal + " " + time;
    doc.text(`                      Asset Name = ${id}
                                    Asset Id = ${id}
                                    Issuer = ${user}
                                    TimeStamp = ${finalTime}
                                    Offer Value = ${value}`, 10, 10);
    doc.save("a4.pdf");
}

export const writeFile = async (file) => {
    console.log(file)
    //const ipfs = await IPFS.create({ repo: "ok" + Math.random() })
    const client = new NFTStorage({ token: apiKey })

    //const cid = await ipfs.add("{ path: ' / downloads / Home.js' }")
    const data = await client.storeDirectory(file)
    console.log(data)


    // setTimeout(async () => {
    //     //const data = await ipfs.get(cid.path)
    //     console.log(data)
    // }, 5000)


}

