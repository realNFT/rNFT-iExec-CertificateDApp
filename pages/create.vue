<template>
    <b-card-text class="row align-content-center justify-content-center">
        <Notification :notif="notif"/>
        <b-col cols="12" xl="4" sm="6">
            <b-form prevent.submit>
                <h1 class="mb-4"><b>Create an Oracle</b></h1>
                <p class="text-justify" style="font-weight: 600;">This Oracle will trigger the API call GET <a href="https://docs.opensea.io/reference/retrieving-a-single-asset">https://api.opensea.io/api/v1/asset/{asset_contract_address}/{token_id}/</a> from OpenSea API.</p>
                <b-form-group>
                    <label for="input-smart-contract">Smart Contract Address:</label>
                    <b-form-input
                        id="input-smart-contract"
                        v-model="form.smartContract"
                        :state="valid.smartContract"
                        aria-describedby="feedback-smartContract"
                        placeholder="Enter the smart contract address"
                        trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="feedback-smartContract">
                        <b>You must enter ERC721 or ERC155 smart contract address.</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <label class="mt-2" for="input-smart-contract-2">Token Id:</label>
                    <b-form-input 
                        id="input-smart-contract-2"
                        min="0"
                        v-model="form.tokenId"
                        :state="valid.tokenId"
                        type="number"
                        aria-describedby="feedback-tokenId"
                        placeholder="Enter the token id"
                        trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="feedback-tokenId">
                        <b>You must enter an existant token Id from the smart contract.</b>
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-button @click="createOracle()" class="mt-4 w-100" variant="primary"><b>Create Oracle</b></b-button>
            </b-form>
        </b-col>
    </b-card-text>
</template>

<script>
import Notification from "@/components/Notification.vue"

import { mapState } from 'vuex';

export default {
    name: "create",
    data() {
        return {
            form:{
                smartContract: this.$store.state.form.smartContract ? this.$store.state.form.smartContract : null,
                tokenId: this.$store.state.form.tokenId ? this.$store.state.form.tokenId : null,
            },
            valid:{
                smartContract: this.$store.state.form.smartContract ? true : null,
                tokenId: this.$store.state.form.tokenId ? true : null,
            },
            notif: null,
        }
    },
    components: {
        Notification
    },
    watch:{
        'form.smartContract'(n){
            let temp = mapState(['form'])
            if(/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract)){
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
            if(this.form.tokenId >= 0){
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
        async createOracle(){
            await this.$axios.get(`https://api.opensea.io/api/v1/asset/${this.form.smartContract}/${this.form.tokenId}/`).then((resp) => {
                 //this.$store.commit("setOracle", true)
            }).catch((err) => {
                console.log(err)
                if(Object.keys(err.response).includes('data') && !err.response.data.success)
                    this.notif= {
                        title: "Error",
                        variant: "danger",
                        message: "You must enter a valid OpenSea call. Please see the documentation below."
                    }
                else
                    this.notif = {
                        title: "Error Undefined",
                        variant: "danger",
                        message: err.message
                    }
            })
        }
    }
}
</script>