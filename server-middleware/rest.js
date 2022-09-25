import CertificateMintJSON from "../solidity/artifacts/contracts/CertificateMint.sol/CertificateMint.json" 
import { IExecOracleFactory, utils } from '@iexec/iexec-oracle-factory-wrapper'
import { ethers } from "ethers";

const rpc = "https://viviani.iex.ec"
const bodyParser = require('body-parser')
const app = require('express')()
const http = require("https");



const provider = new ethers.providers.JsonRpcProvider(rpc)
const CertificateMint = new ethers.Contract(
    "0xc9e63908D67BFeBD55E58F3334a247DE7488C822", // deployed contract
    CertificateMintJSON.abi,
    provider
)
const signer = utils.getSignerFromPrivateKey('bellecour', process.env.PRIVATE_KEY);
const Factory = new IExecOracleFactory(signer)

app.use(bodyParser.json())

app.post('/createOracle', async (req, res) => {

    if(!req.body.form.smartContract && !req.body.form.tokenId)
        return res.status(404).send({message: "Please enter a valid smart contract and token id"})

    const ID = await CertificateMint.connect(signer).getOracleId(ethers.utils.getAddress(req.body.form.smartContract), parseInt(req.body.form.tokenId))
    if(ID !== "0x0000000000000000000000000000000000000000000000000000000000000000")
        return res.status(403).send({message: `Oracle is already present with this ${ID} oracle id.`});
    else{
        let oracleId;
        
        let rawParams = {
            url: `https://api.nftport.xyz/v0/nfts/${req.body.form.smartContract}/${req.body.form.tokenId}?chain=ethereum&refresh_metadata=true`,
            method: 'GET',
            headers: {
                'Authorization': '%API_KEY%',
                'Content-Type': 'application/json'
            },
            dataType: 'string',
            JSONPath: '$.owner',
            apiKey: process.env.API_KEY,
        }
        utils.testRawParams(rawParams)
            .then(() => {
                Factory.createOracle(rawParams)
                .subscribe({
                    error: (e) => {
                        console.log(e); 
                        return res.status(500).send({
                            message: e
                        })
                    },
                    next: (value) => {
                        const { message, ...additionalEntries } = value;
                        if (message === 'ORACLE_ID_COMPUTED'){
                            oracleId = additionalEntries.oracleId;
                        }
                        console.log(message);
                        console.info(JSON.stringify(additionalEntries));
                    },
                    complete: () => {    
                        CertificateMint.connect(signer).newOracleIds(ethers.utils.getAddress(req.body.form.smartContract), parseInt(req.body.form.tokenId), ethers.utils.hexZeroPad(oracleId), {gasLimit: 50000}).then((r) => {
                            return res.send({message: `Oracle has been created for the token ${req.body.form.tokenId} at the address ${req.body.form.smartContract} on Mainnet. Oracle id is ${oracleId}`});
                        })
                        .catch((e) => {
                            console.log(e)
                            return res.status(500).send({
                                message: e
                            });
                        });
                        
                    }
                });

            })
            .catch((err) => {
                return res.status(401).send({
                    message: err.message
                })
            })
    }
})

app.post('/existOracle', (req, res) => {

    if(!req.body.form.smartContract && !req.body.form.tokenId)
        return res.status(404).send({message: "Please enter a valid smart contract and token id"})

    CertificateMint.connect(signer).getOracleId(ethers.utils.getAddress(req.body.form.smartContract), parseInt(req.body.form.tokenId), {gasLimit: 50000}).then((ID) => {
        if(ID !== "0x0000000000000000000000000000000000000000000000000000000000000000")
            return res.status(200).send({message: `Oracle is already present with this ${ID} oracle id.`, status: "Update", id: ID});
        else{
            return res.status(200).send({message: "Oracle doesn't exist.", status: "Create", id: null});
        }
    })
    .catch((e) => {
        console.log(e)
        return res.status(500).send({
            message: `Error. Invalid argument ${req.body.form.smartContract} ${req.body.form.tokenId}`
        })
    })
})

app.post('/readOracle', (req, res) => {

    if(!req.body.form.smartContract && !req.body.form.tokenId)
        return res.status(404).send({message: "Please enter a valid smart contract and token id"})
    
    CertificateMint.connect(signer).getOracleValue(ethers.utils.getAddress(req.body.form.smartContract), parseInt(req.body.form.tokenId),{gasLimit: 50000}).then((rep) => {
        if(rep.value)
            return res.status(200).send({message: `Owner of the ${req.body.form.tokenId} at address ${req.body.form.smartContract} is ${rep.value.toString()}.`, value: rep.value.toString()});
    })
})

app.post('/updateOracle', (req, res) => {
    let rawParams = {
        url: `https://api.nftport.xyz/v0/nfts/${req.body.form.smartContract}/${req.body.form.tokenId}?chain=ethereum&refresh_metadata=true`,
        method: 'GET',
        headers: {
            'Authorization': '%API_KEY%',
            'Content-Type': 'application/json'
        },
        dataType: 'string',
        JSONPath: '$.owner',
        dataset: "0x12F9524704A5B8831D76C40000dAFF85e0DA5479",
    }

    Factory.updateOracle(rawParams)
        .subscribe({
            error: (e) => {
                console.log(e); 
                return res.status(500).send({
                    message: e
                })
            },
            next: (value) => {
                const { message, ...additionalEntries } = value;
                if (message === 'ORACLE_ID_COMPUTED')
                    oracleId = additionalEntries.oracleId;
                console.log(message);
                console.info(JSON.stringify(additionalEntries));
            },
            complete: () => {
                return res.status(200).send({
                    message: "Oracle has been updated"
                })
            }
    })
})

app.get('/custom', (req, res) => {
    console.log(req.query)
    CertificateMint.connect(signer).newOracleIds(ethers.utils.getAddress(req.query.smartContract), parseInt(req.query.tokenId), ethers.utils.hexZeroPad(req.query.oracleId), {value: 0, gasLimit: 50000, nonce: 1200}).then((r) => {
        console.log(r)
        return res.send({message: `Oracle has been created for the token ${req.query.tokenId} at the address ${req.query.smartContract} on Mainnet. Oracle id is ${req.query.oracleId}`});
    })
    .catch((e) => {
        console.log(e)
        return res.status(500).send({
            message: e
        });
    });
})


app.get('/test', (req, res) => {
    console.log(req.query)
    CertificateMint.connect(signer).getOracleId(ethers.utils.getAddress(req.query.smartContract), parseInt(req.query.tokenId), {value: 0, gasLimit: 50000}).then((id) => {
        return res.send({message: `${ethers.utils.hexZeroPad(req.query.oracleId)} ------------- ${ethers.utils.hexZeroPad(id)}`});
    })
    .catch((e) => {
        console.log(e)
        return res.status(500).send({
            message: e
        });
    });
})

// fetch NFTs of an account - I'm not sure about the code here :


// const options = {
//   method: "GET",
//   hostname: "api.nftport.xyz",
//   port: null,
//   path: "/v0/accounts/0xABf804a94d3E7202d8D7dF4809c5140c15B59434?chain=ethereum",
//   headers: {
//     "Content-Type": "application/json",
//     // Authorization: "0a808c9d-adee-4adc-8127-2a271075f458",
//     Authorization: process.env.API_KEY,
//   },
// };

// const req = http.request(options, function (res) {
//   const chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     const body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// req.end();

// show details about fetched NFTs of an account :


const options2 = {
  method: "GET",
  hostname: "api.nftport.xyz",
  port: null,
  path: "/v0/nfts/0xce10106559932d385c20f0f99c245ab4bff365f9/306?chain=ethereum&refresh_metadata=true",
  headers: {
    "Content-Type": "application/json",
    Authorization: "0a808c9d-adee-4adc-8127-2a271075f458",
  },
};

const req1 = http.request(options2, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req1.end();


module.exports = app