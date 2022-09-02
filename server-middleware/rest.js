import CertificateMint from "../solidity/artifacts/contracts/CertificateMint.sol/CertificateMint.json" 
import { IExecOracleFactory } from '../node_modules/@iexec/iexec-oracle-factory-wrapper'
import { ethers } from "ethers";

const rpc = "https://viviani.iex.ec"
const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json())
app.all('/createOracle', (req, res) => {

    console.log(req.body);

    
    const provider = new ethers.providers.JsonRpcProvider(rpc)
    CertificateMint = new ethers.Contract(
        "", // Address
        CertificateMint.abi,
        provider
    ) 
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const Factory = new IExecOracleFactory(signer)

    /*let paramSet;
    let cid;
    let oracleId;

    factory.createOracle({
        url: `https://api.opensea.io/api/v1/asset/${this.form.smartContract}/${this.form.tokenId}/`,
        method: 'GET',
        dataType: 'string',
        JSONPath: '$.data.last_sale.payment_token.usd_price',
    })
    .subscribe({
        error: (e) => console.error(e),
        next: (value) => {
            const { message, ...additionalEntries } = value;
            if (message === 'PARAM_SET_CREATED') {
                paramSet = additionalEntries.paramSet;
            }
            if (message === 'PARAM_SET_UPLOADED') {
                cid = additionalEntries.cid;
            }
            if (message === 'ORACLE_ID_COMPUTED')
                oracleId = additionalEntries.oracleId;

            console.log(message);
            console.info(JSON.stringify(additionalEntries));
        },
        complete: () => {
            console.log(`Oracle created, paramSet CID is ${cid}!`);
            console.log(`paramSet: "${paramSet}"`);
            console.log(`oracleId: "${oracleId}"`);
        },
    });
    */

    return res.json({ data: 'data' })
})

module.exports = app

    

    // next is a function to call to invoke the next middleware
    // Don't forget to call next at the end if your middleware is not an endpoint!