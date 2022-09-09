import Web3ModalVue from "web3modal-vue";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Torus from "@toruslabs/torus-embed";

export default {
    components: {
        Web3ModalVue
    },
    data() {
        return {
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        infuraId:
                            "4a123ad7b64e4650b483101494ba445a", // a changer
                    },
                },
                torus: {
                    package: Torus, // required
                    options: {
                        networkParams: {
                            host: "https://viviani.iex.ec",
                            chainId: 134,
                        },

                    },
                },
            },
            provider: null,
            library: null,
            network: null,
        }
    },
    methods: {
        async connect() {
            this.provider = await this.$refs.web3modal.connect();
            if (this.provider === undefined) {
                this.notif = {
                    title: this.$t("error.error_msg"),
                    variant: "danger",
                    message: "error",
                };
                return;
            }
            this.library = new ethers.providers.Web3Provider(this.provider);
            this.library.pollingInterval = 12000;
            

            const accounts = await this.library.listAccounts();
            if (accounts.length > 0){
                this.isConnected = accounts[0]; // Comit persisted store
                this.$store.commit("setUser", this.isConnected)
            }
            this.network = await this.library.getNetwork().chainId;
            

            this.provider.on("connect", async (info) => {
                this.chainId = parseInt(info.chainId);
                if (this.chainId != '134') 
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x86",
                            rpcUrls: ["https://viviani.iex.ec"],
                            chainName: "iExec Sidechain",
                            nativeCurrency: {
                                name: "xRLC",
                                symbol: "xRLC",
                                decimals: 18
                            },
                            blockExplorerUrls: ["https://blockscout-viviani.iex.ec"]
                        }]
                    });
                this.network = this.chainId;
                console.log("connect", info);
            });

            this.provider.on("chainChanged", async (chainId) => {
                this.chainId = parseInt(chainId);
                if (this.chainId != '134') 
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x86",
                            rpcUrls: ["https://viviani.iex.ec"],
                            chainName: "iExec Sidechain",
                            nativeCurrency: {
                                name: "xRLC",
                                symbol: "xRLC",
                                decimals: 18
                            },
                            blockExplorerUrls: ["https://blockscout-viviani.iex.ec"]
                        }]
                    });
                if (chainId) console.log("chainChanged", parseInt(chainId));
            });
        },
        trunc(addr) {
            addr = String(addr)
            return addr.substring(0,5) + "...." + addr.substring(addr.length - 3,addr.length)
        },
        disconnect() {
            this.isConnected = ""
            this.$store.commit("setUser", "")
            this.isDeployer = this.$store.state.deployer === this.isConnected
            sessionStorage.clear()
        },
    }
}
