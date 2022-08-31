const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certificate Mint", () => {

    /** 
     *  CHECK LIST
     * 
     *  1. Check good deployment:
     *   - MockCertificateMint
     *   - MockERC721
     *   - MockERC1155
     *   - MockIExecOracle
     * 
     *  2. Check newOracleIds function push and reverts
     *  3. Check getOracleValue function and reverts 
     *  4. Check mint function and reverts 
     */

    let MockERC721
    let MockERC1155
    let MockIExecOracle
    let MockCertificateMint
    let mockERC721;
    let mockERC1155;
    let mockIExecOracle;
    let mockCertificateMint;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;

    //Step 2.
    let smartContract721
    let tokenId721
    let oracleId721

    //Step 3. 
    let smartContract1155
    let tokenId1155
    let oracleId1155
    
    before(async () => {
        // Define variables

        MockERC721 = await ethers.getContractFactory("MockERC721");
        MockERC1155 = await ethers.getContractFactory("MockERC1155");
        MockIExecOracle = await ethers.getContractFactory("MockIExecOracle");
        MockCertificateMint = await ethers.getContractFactory("MockCertificateMint");

        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    });

    beforeEach(async () => {
        // Deploy a mock ERC721 contract with a mint of token 0 to addr1
        mockERC721 = await MockERC721.connect(owner).deploy(addr1.address);
        await mockERC721.deployed();

        // Deploy a mock ERC155 contract with a mint of token 2 to addr2
        mockERC1155 = await MockERC1155.connect(owner).deploy(addr2.address);
        await mockERC1155.deployed();

        // Deploy a mock contract of iExec oracle with the previous mock ERC NFTs
        mockIExecOracle = await MockIExecOracle.connect(owner).deploy(addr1.address, 0, addr2.address, 2);
        await mockIExecOracle.deployed();

        mockCertificateMint = await MockCertificateMint.connect(owner).deploy(mockIExecOracle.address);
        await mockCertificateMint.deployed();
        
        // 2. Check newOracleIds function push and reverts:
        smartContract721 = mockERC721.address;
        tokenId721 = 0;
        oracleId721 = ethers.utils.solidityKeccak256([ "address", "uint256" ], [smartContract721, tokenId721]); // To keep simple the Oracle Id here is the same has the hash key

        // 3. Check getOracleValue function and reverts 
        smartContract1155 = mockERC1155.address;
        tokenId1155 = 2;
        tokenIdWrong = 100;
        oracleId1155 = ethers.utils.solidityKeccak256([ "address", "uint256" ], [smartContract1155, tokenId1155]);
        oracleIdWrong = ethers.utils.solidityKeccak256([ "address", "uint256" ], [smartContract1155, tokenIdWrong]);
    });

    describe("1. Check good deployment", () => {

        it("mockERC721 should be deployed and addr1 should own token 0", async () => {
            expect(await mockERC721.ownerOf(0)).to.equal(addr1.address);
        });
    
        it("mockERC155 should be deployed and addr2 should own token 2", async () => {
            expect(await mockERC1155.balanceOf(addr2.address, 2)).to.equal(1);
        });

        it("mockIExecOracle should be deployed and hashKeyERC721, hashKeyERC1155 should be correct", async () => {
            expect(await mockIExecOracle.hashKeyERC721()).to.equal(ethers.utils.solidityKeccak256(["address", "uint256"], [addr1.address, 0]));
            expect(await mockIExecOracle.hashKeyERC1155()).to.equal(ethers.utils.solidityKeccak256(["address", "uint256"], [addr2.address, 2]));
        });

        it("mockCertificateMint should be deployed", async () => {
            expect(await mockCertificateMint.getOracleContract()).to.equal(mockIExecOracle.address);
        });

        it("mockCertificateMint check changeBase uri", async () => {
            mockCertificateMint.connect(addr1).mint(smartContract721, tokenId721).then(async () => {
                expect(await mockCertificateMint.tokenURI(tokenId721)).to.equal("https://metadatas.rnft.fake/0");
                mockCertificateMint.connect(owner).changeBaseURI("test/").then(async () => {
                    expect(await mockCertificateMint.tokenURI(tokenId721)).to.equal("test/0");
                });
            });
        });

    });

    describe("2. Check newOracleIds function push and reverts", () => { 
        it("should revert from caller different than owner", async () => {
            await expect(mockCertificateMint.connect(addr1).newOracleIds(smartContract721, tokenId721, oracleId721)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should revert for null oracleId value", async () => {
            await expect(mockCertificateMint.connect(owner).newOracleIds(smartContract721, tokenId721, ethers.constants.HashZero)).to.be.revertedWith("CertificateMint - Oracle Id must be different of 0");
        });

        it("getOracleId should be set correctly", async () => {
            await mockCertificateMint.connect(owner).newOracleIds(smartContract721, tokenId721, oracleId721);
            expect(await mockCertificateMint.connect(owner).getOracleId(smartContract721, tokenId721)).to.equal(oracleId721);
        })

        it("should revert for oracleId already set", async () => {
            await mockCertificateMint.connect(owner).newOracleIds(smartContract721, tokenId721, oracleId721);
            await expect(mockCertificateMint.connect(owner).newOracleIds(smartContract721, tokenId721, oracleId721)).to.be.revertedWith("CertificateMint - Oracle Id already exist");
        })

    }); 

    describe("3. Check getOracleValue function and reverts ", () => {
        it("getOracleValue should revert because Oracle doesn't exist", async () => {
            await expect(mockCertificateMint.connect(owner).getOracleValue(smartContract1155, tokenIdWrong)).to.be.revertedWith('CertificateMint - Oracle doesn\'t exist, please create one before call this function');
        });

        it("getOracleValue should revert because zero addrress", async () => {
            await expect(mockCertificateMint.connect(owner).getOracleValue(ethers.constants.AddressZero, tokenIdWrong)).to.be.revertedWith("CertificateMint - Smart contract address need to be different to the zero address");
        });

        it("getOracleValue should return 1.2 ether oracle value", async () => {
            mockCertificateMint.connect(owner).newOracleIds(smartContract721, tokenId721, oracleId721).then( async () => {
                expect(await mockCertificateMint.getOracleValue(smartContract721, tokenId721)).to.equal(ethers.utils.parseEther("1.2").toString())
            });
        });

        it("getOracleValue should return 1.2 ether oracle value", async () => {
            mockCertificateMint.connect(owner).newOracleIds(smartContract1155, tokenId1155, oracleId1155).then( async () => {
                expect((await mockCertificateMint.getOracleValue(smartContract1155, tokenId1155))).to.equal(ethers.utils.parseEther("0.3").toString());
            });
        });
    });

    describe("4. Check mint function and reverts", () => {
        it("should revert because addr4.address has not a valid interface", async () => {
           await expect(mockCertificateMint.connect(addr3).mint(addr3.address, 0)).to.be.revertedWith("CertificateMint - Only ERC721 and ERC1155 contract standards are supported");
        });
        
        it("should revert because addr3 isn't owner of the NFT from ERC1155 contract", async () => {
            await expect(mockCertificateMint.connect(addr3).mint(smartContract1155, tokenId1155)).to.be.revertedWith("CertificateMint - ERC1155 - You are not the owner of this NFT");
        })


        it("should revert because addr4 isn't owner of the NFT from ERC721 contract", async () => {
            await expect(mockCertificateMint.connect(addr4).mint(smartContract721, tokenId721)).to.be.revertedWith("CertificateMint - ERC721 - You are not the owner of this NFT");
        })

        it("should mint one reproduction certificate for addr2 ERC1155", async () => {
            mockCertificateMint.connect(addr2).mint(smartContract1155, tokenId1155).then(async () => {
                expect(await mockCertificateMint.balanceOf(addr2)).to.equal(1);
            });
        });

        it("should mint one reproduction certificate for addr1 ERC721", async () => {
            mockCertificateMint.connect(addr1).mint(smartContract721, tokenId721).then(async () => {
                expect(await mockCertificateMint.balanceOf(addr1)).to.equal(1);
            });
        })
    });
})