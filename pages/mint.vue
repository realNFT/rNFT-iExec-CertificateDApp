<template>
    <div class="row align-content-center justify-content-center">
        <Notification :notif="notif"/>
         <client-only>
            <web3-modal-vue ref="web3modal" theme="dark" :provider-options="providerOptions" cache-provider />
         </client-only>
        <b-col cols="12" xl="4" sm="6">
            <b-form prevent>
                <h1 class="mb-4"><b>Mint your Certificate</b></h1>
                <p class="text-justify" style="font-weight: 600;">Mint the certificate only if you are owner of the NFT on mainnet.</p>
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
                    <label for="input-smart-contract-2">Token Id:  </label>
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
                <b-button v-if="!allSelected" class="mb-3 w-100" variant="secondary" @click="form.support = options.support.map((i) => i.value); form.size = options.size.map((i) => i.value); allSelected = true"><b>Authorized All</b></b-button>
                <b-button v-else class="mb-3 w-100" variant="secondary"  @click="form.support = []; form.size = []; allSelected=false"><b>Unauthorized All</b></b-button>
                <b-form-group>
                    <label for="input-support">Supports authorized:</label>
                    <b-form-checkbox-group
                        id="input-support"
                        v-model="form.support"
                        :options="options.support"
                        :state="valid.support"
                        aria-describedby="feedback-support"
                    ></b-form-checkbox-group>
                    <b-form-invalid-feedback id="feedback-support">
                        <b>You must choose one of the choices proposed.</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <label for="input-size">Sizes authorized:</label>
                    <b-form-checkbox-group
                        id="input-size"
                        v-model="form.size"
                        :options="options.size"
                        :state="valid.size"
                        aria-describedby="feedback-size"
                    ></b-form-checkbox-group>
                    <b-form-invalid-feedback id="feedback-size">
                        <b>You must choose one of the choices proposed.</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <label for="input-number">Total edition(s) authorized:</label>
                    <b-form-input
                        v-if="!loading"
                        id="input-number"
                        min="1"
                        max="1000"
                        v-model="form.number"
                        :state="valid.number"
                        type="number"
                         placeholder="1"
                        aria-describedby="feedback-number"
                    ></b-form-input>
                    <b-skeleton v-else type="input"></b-skeleton>
                    <b-form-invalid-feedback id="feedback-number">
                        <b>You must fulfill a number between 1 and 1000</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox
                        id="input-aggre"
                        v-model="form.agree"
                        :state="valid.agree"
                        name="input-agree"
                        class="small"
                        aria-describedby="feedback-agree"
                        required
                        style="font-weight: 600;"
                        >
                        By completing the information below, you are assuming ownership of the NFT intellectual property.
                    </b-form-checkbox>
                    <b-form-invalid-feedback id="feedback-agree">
                        <b>You must fulfill a number between 1 and 1000</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group  v-if="!loading">
                    <b-button v-if="valid.smartContract && valid.tokenId && status==='Create'" class="mt-4 w-100" variant="primary" @click="$router.push('/oracle')"><b>Create Oracle</b></b-button>
                    <b-button v-else-if="valid.smartContract && valid.tokenId && status==='Update'" class="mt-4 w-100" variant="primary" @click="$router.push('/oracle')"><b>Update Oracle</b></b-button>
                    <b-button v-else class="mt-4 w-100" variant="primary" @click="mint()" :disabled="!isConnected  || value === null || value != isConnected" ><b>Mint Certificate</b></b-button>
                    
                    <p v-if="!isConnected && status != 'Create'" class="text-danger small mt-2"><b>You must be connected with your wallet to interact with the mint function.</b></p>
                    <p v-else-if="value != null && value != isConnected" class="text-danger small mt-2"><b>You must be the owner of the NFT pointed by the smart contract and token id.</b></p>
                </b-form-group>
                <b-form-group v-else>
                    <b-skeleton class="w-100" variant="primary" type="button"></b-skeleton>
                </b-form-group>
            </b-form>
        </b-col>
    </div> 
</template>

<script>
import { mapState } from 'vuex';
import Web3Modal from "@/mixins/web3modal"
import Notification from "@/components/Notification"
import Web3ModalVue from "~/plugins/web3modalVue";
import CertificateMintJSON from "../solidity/artifacts/contracts/CertificateMint.sol/CertificateMint.json";
import { ethers } from "ethers";

export default {
    name: "mint",
    components:{
        Notification,
        Web3ModalVue
    },
    mixins: [Web3Modal],
    data() {
        return {
            allSelected: false,
            options:{
                support: [
                    { text: 'Canva', value: 'canva' },
                    { text: 'Metal Plate', value: 'metal' },
                ],
                size: [
                    { text: '30cm x 30cm', value: '30' },
                    { text: '50cm x 50cm', value: '50' },
                    { text: '80cm x 80cm', value: '80' },
                ],
            },
            form:{
                smartContract: this.$store.state.form.smartContract ? this.$store.state.form.smartContract : null,
                tokenId: this.$store.state.form.tokenId ? this.$store.state.form.tokenId : null,
                agree: this.$store.state.form.agree ? this.$store.state.form.agree : null,
                support: this.$store.state.form.support ? this.$store.state.form.support : null,
                size: this.$store.state.form.size ? this.$store.state.form.size : null,
                number: this.$store.state.form.number ? this.$store.state.form.number : null,
            },
            valid:{
                smartContract: this.$store.state.form.smartContract ? true : null,
                tokenId: this.$store.state.form.tokenId ? true : null,
                agree: this.$store.state.form.agree ? true : null,
                support: this.$store.state.form.support ? true : null,
                size: this.$store.state.form.size ? true : null,
                number: this.$store.state.form.number ? true : null,
            },
            isConnected: this.$store.state.isConnected,
            value: null,
            loading: null,
            notif: null,
            status: null
        } 
    },
    watch:{
        'form.smartContract'(n){
            let temp = mapState(['form'])
            if(/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract)){
                for(var key in this.form)
                    temp[key] = this.form[key]
                this.valid.smartContract = true
                this.$store.commit("setDataForm", temp)
            }
            else{
                for(var key in this.form)
                    temp[key] = this.form[key]
                temp.smartContract = ""
                this.valid.smartContract = false
                this.$store.commit("setDataForm", temp)
            }
            
        },
        'form.tokenId'(n){
            let temp = mapState(['form'])
            if(/^[0-9]+$/.test(this.form.tokenId) && this.form.tokenId >= 0){
                for(var key in this.form)
                    temp[key] = this.form[key]
                        
                this.valid.tokenId = true
                this.$store.commit("setDataForm", temp)
            }
            else{
                
               for(var key in this.form)
                    temp[key] = this.form[key]
                temp.tokenId = ""
                this.valid.tokenId = false
                this.$store.commit("setDataForm", temp)
            }
            
        },
        'form.support'(n){
            let temp = mapState(['form'])
            if(n.length > 0){
                for(var key in this.form)
                    temp[key] = this.form[key]
                this.$store.commit("setDataForm", temp)
                this.valid.support = true
            }
            else{
                this.valid.support = false 
                for(var key in this.form)
                    temp[key] = this.form[key]
                temp.support = []
                this.$store.commit("setDataForm", temp)
            }
            
        },
        'form.size'(n){
            let temp = mapState(['form'])
            if(n.length > 0){
                for(var key in this.form)
                    temp[key] = this.form[key]
                this.$store.commit("setDataForm", temp)
                this.valid.size = true
            }
            else{
                this.valid.size = false 
                for(var key in this.form)
                    temp[key] = this.form[key]
                temp.size = []
                this.$store.commit("setDataForm", temp)
            }
        },
        'form.number'(n){
            let temp = mapState(['form'])
            if(n > 0){
                for(var key in this.form)
                    temp[key] = this.form[key]
                this.$store.commit("setDataForm", temp)
                this.valid.number = true
            }
            else{
                this.valid.number = false 
                for(var key in this.form)
                    temp[key] = this.form[key]
                temp.number = ""
                this.$store.commit("setDataForm", temp)
            }
            
        },
        'form.agree'(n){
            let temp = mapState(['form'])
            if(n === true){
                for(var key in this.form)
                    temp[key] = this.form[key]
                this.valid.agree = true
                this.$store.commit("setDataForm", temp)
            }
            else{
                this.valid.agree = false 
                for(var key in this.form)
                    temp[key] = this.form[key]
                temp.agree =false
                this.$store.commit("setDataForm", temp)
            }
            
        },
        '$store.state.isConnected'(n){
            this.isConnected = n
        }
    },
    methods:{
        checkExisting(){
            if(/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract) && /^[0-9]+$/.test(this.form.tokenId) && !this.checked){
                this.checked = true
                this.existOracle()
            }
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
        async mint(){
            this.loading = true
            for(var key in this.valid)
                if(!this.valid[key]) return this.notif = {
                    title: "Error",
                    variant: "danger",
                    message: {smartContract: 'Smart Contract input must be valid.', tokenId: 'Token ID input must be valid.', agree: 'You must assuming the ownership of the IP.', support: 'Support input must be valid.', size: 'Size input must be valid', number: 'Number input must be valid.'}[k]
                } 
            await this.connect();
            const signer = await this.library.getSigner();

            const CertificateMint = new ethers.Contract(
                "0xc9e63908D67BFeBD55E58F3334a247DE7488C822", // deployed contract
                CertificateMintJSON.abi,
                signer
            )
            
            CertificateMint.mint(ethers.utils.getAddress(this.form.smartContract), parseInt(this.form.tokenId)).then(() => {
                this.notif = {
                    title: "Success",
                    variant: "success",
                    message: "You successfully mint your certificate"
                }
            })
            .catch((e) => {
                console.log(e)
                this.notif={
                    title:`${e.data.data}`,
                    variant: "danger",
                    message: `Error code : ${e.data.code}, ${e.data.message}`,
                }
            })
            this.loading = false
        }
    }
}
</script>

<style>

    .custom-control-label > span{
        font-weight: 600;
    }
    label{
        font-weight: 900;
    }
</style>