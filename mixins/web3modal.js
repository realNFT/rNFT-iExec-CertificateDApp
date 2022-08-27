import Web3ModalVue from "web3modal-vue";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
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
                fortmatic: {
                    package: Fortmatic, // required
                    options: {
                        key: "pk_live_9D22DCF3F3B8F3A1", // required a changer
                        network: {
                            rpcUrl: "https://rpc-mainnet.maticvigil.com",
                            chainId: 137,
                        },
                    },
                },
                torus: {
                    package: Torus, // required
                    options: {
                        networkParams: {
                            host: "https://rpc-mainnet.maticvigil.com",
                            chainId: 137,
                        },

                    },
                },
            },
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
            if (accounts.length > 0) 
                this.account = accounts[0]; // Comit persisted store

            this.network = await this.library.getNetwork().chainId;

            this.provider.on("connect", async (info) => {
                this.chainId = parseInt(info.chainId);
                this.network = this.chainId;
                console.log("connect", info);
            });

            this.provider.on("chainChanged", async (chainId) => {
                this.chainId = parseInt(chainId);
                if (chainId) console.log("chainChanged", parseInt(chainId));
            });
        }
    }
}