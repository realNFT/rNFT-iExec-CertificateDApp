<template>
    <div class="row align-content-center justify-content-center">
        <Notification :notif="notif"/>
        <b-col cols="12" xl="4" sm="6">
            <b-form prevent.submit>
                <h1 class="mb-4"><b>My NFTs</b></h1>
                <!-- <p class="text-justify small" style="font-weight: 600;">This Oracle will trigger the API call GET <a href="https://docs.nftport.xyz/docs/nftport/b3A6MjAzNDUzNTM-retrieve-nft-details">https://api.nftport.xyz/v0/nfts/{contract_address}/{token_id}</a> from NFTPort API to find the actual owner of the NFT on Etherum mainnet.</p> -->
                <b-form-group>
                    <label for="input-smart-contract">Smart Contract Address:</label>
                    <span v-b-tooltip.hover title="Refresh oracle data"><a href="" class="pl-2" @click="checkExisting()"><font-awesome-icon  style="max-height: 18px" icon="rotate"/> </a></span>
                    <b-form-input
                        v-if="!loading"
                        id="input-smart-contract"
                        v-model="form.smartContract"
                        :state="valid.smartContract"
                        aria-describedby="feedback-smartContract"
                        placeholder="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
                        trim
                    ></b-form-input>
                    <b-skeleton v-else type="input"></b-skeleton>
                    <b-form-invalid-feedback id="feedback-smartContract">
                        <b>You must enter ERC721 or ERC155 smart contract address.</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <label class="mt-2" for="input-smart-contract-2">Token Id:</label>
                    <span v-b-tooltip.hover title="Refresh oracle data"><a href="" class="pl-2" @click="checkExisting()"><font-awesome-icon  style="max-height: 18px" icon="rotate"/> </a></span>
                    <b-form-input 
                        v-if="!loading"
                        id="input-smart-contract-2"
                        min="0"
                        v-model="form.tokenId"
                        :state="valid.tokenId"
                        type="number"
                        aria-describedby="feedback-tokenId"
                        placeholder="0"
                        trim
                    ></b-form-input>
                    <b-skeleton v-else type="input"></b-skeleton>
                    <b-form-invalid-feedback id="feedback-tokenId">
                        <b>You must enter an existant token Id from the smart contract.</b>
                    </b-form-invalid-feedback>
                </b-form-group>    
                <b-form-group v-if="oracleId">
                    <label class="mt-2" for="input-smart-contract-2">Oracle ID:</label>
                    <b-form-input 
                        v-if="!loading"
                        id="input-smart-contract-3"
                        min="0"
                        type="text"
                        trim
                        v-model="oracleId"
                        disabled
                    ></b-form-input>
                    <b-skeleton v-else type="input"></b-skeleton>
                </b-form-group>
                <b-form-group v-if="value">
                    <label class="mt-2" for="input-smart-contract-2">Owner of the NFT (Oracle value):</label>
                    <b-form-input 
                        v-if="!loading"
                        id="input-smart-contract-4"
                        min="0"
                        v-model="value"
                        type="number"
                        trim
                        disabled
                    ></b-form-input>
                    <b-skeleton v-else type="input"></b-skeleton>
                </b-form-group>  

                <b-form-group class="pt-4">
                    <b-button v-if="!loading" @click="status === 'Create' ? createOracle() : updateOracle()" class="w-100" variant="primary"><b>{{`${status} Oracle`}}</b></b-button>
                    <b-skeleton v-else   class="w-100" variant="primary" type="button"></b-skeleton>
                </b-form-group>
            </b-form>
        </b-col>
    </div>
</template>

<script>
import Notification from "@/components/Notification.vue"
import { mapState } from 'vuex';

export default {
    name: "oracle",
    data() {
        return {
            status: null,
            oracleId: null,
            value: null,
            form:{
                smartContract: this.$store.state.form.smartContract ? this.$store.state.form.smartContract : null,
                tokenId: this.$store.state.form.tokenId ? this.$store.state.form.tokenId : null,
            },
            valid:{
                smartContract: this.$store.state.form.smartContract ? true : null,
                tokenId: this.$store.state.form.tokenId ? true : null,
            },
            notif: null,
            loading: true,
        }
    },
    components: {
        Notification
    },
    mounted(){
        if(this.form.smartContract && this.form.tokenId)
            this.existOracle()
        else{
            this.status = "Create"
            this.loading = false
        }
    },
    watch:{
        'form.smartContract'(n){
            let temp = mapState(['form'])
            if(/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract)){
                console.log(temp)
                temp.smartContract = n
                temp.tokenId = this.form.tokenId
                this.valid.smartContract = true
                this.$store.commit("setDataForm", temp)
            }
            else{
                temp.smartContract = ""
                temp.tokenId = this.form.tokenId
                this.valid.smartContract = false
                this.$store.commit("setDataForm", temp)
            }
            
        },
        'form.tokenId'(n){
            let temp = mapState(['form'])
            if(/^[0-9]+$/.test(this.form.tokenId) && this.form.tokenId >= 0){
                temp.smartContract = this.form.smartContract
                temp.tokenId = n

                this.valid.tokenId = true
            }
            else{
                temp.smartContract = this.form.smartContract
                temp.tokenId = ""
                this.valid.tokenId = false
            }
            this.$store.commit("setDataForm", temp)
        }
    },
    methods:{
        checkExisting(){
            if(/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract) && /^[0-9]+$/.test(this.form.tokenId))
                this.existOracle()
        },
        createOracle(){     
            this.loading = true
            this.$axios.post("/createOracle", {
                form: this.form 
            })
            .then((resp) => {
                
                this.notif= {
                    title: resp.status === 200 ? "Success" : "Error",
                    variant: resp.status === 200 ? "success" : "danger",
                    message: resp.data.message
                }
                this.readOracle()
                this.loading = false
            })
            .catch((err) => {
                this.notif = {
                    title: "Error",
                    variant: "danger",
                    message: err.response.data.message
                }
                this.loading = false
            })
        },
        existOracle(){
            this.value = null
            this.oracleId = null
            this.loading = true
            this.$axios.post("/existOracle", {
                form: this.form 
            })
            .then((resp) => {
                this.status = resp.data.status
                this.oracleId = resp.data.id ? resp.data.id : null
                
                if(resp.data.id)
                    this.readOracle()

                this.loading = false
            })
            .catch((err) => {
                console.log(err.response.data)
                this.notif = {
                    title: "Error",
                    variant: "danger",
                    message: err.response.data.message
                }
                this.loading = false
            })
        },
        readOracle(){
            this.loading = true
            this.$axios.post("/readOracle", {
                form: this.form 
            })
            .then((resp) => {
                this.value = resp.data.value
                this.loading = false
            })
            .catch((err) => {
                this.notif = {
                    title: "Error",
                    variant: "danger",
                    message: err.response.data.message
                }
                this.loading = false
            })
        },
        updateOracle(){
            this.loading = true
            this.$axios.post("/updateOracle", {
                form: this.form 
            })
            .then((resp) => {
                this.notif= {
                    title: resp.status === 200 ? "Success" : "Error",
                    variant: resp.status === 200 ? "success" : "danger",
                    message: resp.data.message
                }
                this.readOracle()
                this.loading = false
            })
            .catch((err) => {
                this.notif = {
                    title: "Error",
                    variant: "danger",
                    message: err.response.data.message
                }
                this.loading = false
            })
        } 
    }
}
</script>