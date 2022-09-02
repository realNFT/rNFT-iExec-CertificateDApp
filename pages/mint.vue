<template>
    <b-card-text class="row align-content-center justify-content-center">
        <b-col cols="12" xl="4" sm="6">
            <b-form prevent.submit>
                <h1 class="mb-4"><b>Mint your Certificate</b></h1>
                <p class="text-justify" style="font-weight: 600;">You can mint the Reproduction Certificate of .</p>
                <b-row>
                    <b-form-group class="col-8">
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
                    <b-form-group class="col-4">
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
                </b-row>
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
                        id="input-number"
                        min="1"
                        max="1000"
                        v-model="form.number"
                        :state="valid.number"
                        type="number"
                        aria-describedby="feedback-number"
                    ></b-form-input>
                    <b-form-invalid-feedback id="feedback-number">
                        <b>You must fulfill a number between 1 and 1000</b>
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox
                        id="input-aggre"
                        v-model="form.agree"
                        name="input-aggre"
                        class="small"
                        required
                        >
                        By completing the information below, you are assuming ownership of the NFT intellectual property.
                    </b-form-checkbox>
                </b-form-group>
                
                <b-button class="mt-4 w-100" variant="primary"><b>Mint Certificate</b></b-button>
            </b-form>
        </b-col>
    </b-card-text>
</template>

<script>
export default {
    name: "mint",
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
                agree: null,
                nft: null, 
                support: [],
                size: [],
                number: null,
                price: null
            },
            valid:{
                agree: null,
                nft: null, 
                support: null,
                size: null,
                number: null,
                price: null
            }
        } 
    },
    watch:{
    
    },
}
</script>