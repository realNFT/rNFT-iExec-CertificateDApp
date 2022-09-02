const hre = require("hardhat");

// constant used 
const iExecOracleAddr = "0x3eca1B216A7DF1C7689aEb259fFB83ADFB894E7f"
const metadataURI = "https://rnft.fr/"

async function main() {

  const CertificateMint = await hre.ethers.getContractFactory("CertificateMint");
  const contract = await CertificateMint.deploy(iExecOracleAddr, metadataURI);

  await contract.deployed();

  console.log(
    `CertificateMint deployed to ${contract.address} with ${iExecOracleAddr} and ${metadataUR}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
