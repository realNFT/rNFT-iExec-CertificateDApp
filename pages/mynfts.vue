<template>
  <div class="flex-column align-items-center justify-content-center">
    <div v-if="loader" class="loader-div">
      <div class="loader"></div>
    </div>
    <Notification :notif="notif"/>
    <b-col cols="12" xl="12" sm="12">
      <h1 class="text-center"><b>My NFTs</b></h1>
      <div class="row align-content-center justify-content-center">
        <Card
          v-for="nft in nfts"
          v-bind:key="nft.name+nft.token_id"
          v-bind:token_id="nft.token_id"
          v-bind:name="nft.name"
          v-bind:image_url="nft.image_url"
        ></Card>
      </div>
    </b-col>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue"
import {mapState} from 'vuex';
import Card from "../components/Card";

export default {
  name: "mynfts",
  data() {
    return {
      status: null,
      nfts: [],
      form: {
        smartContract: this.$store.state.form.smartContract ? this.$store.state.form.smartContract : null,
        tokenId: this.$store.state.form.tokenId ? this.$store.state.form.tokenId : null,
      },
      valid: {
        smartContract: this.$store.state.form.smartContract ? true : null,
        tokenId: this.$store.state.form.tokenId ? true : null,
      },
      notif: null,
      loading: true,
      loader: true
    }
  },
  components: {
    Card,
    Notification
  },
  async mounted() {
    // (async ()=>{
    //
    // })();

    console.log("hello I'm mounted with ", this.nfts);
    const walledAddress = this.$store.state.isConnected;
    if(!walledAddress)return;

    const result = await this.listNft(walledAddress);

    // this.nfts = await this.listNft(walledAddress);

    const nftsToDisplay = []

    console.log("result", result)
    for (let nft of result) {
      const obj = {
        name: nft.contract.name,
        token_id: nft.nft.token_id,
        image_url: undefined
      };
      if (nft.nft.hasOwnProperty("metadata_url") && nft.contract.type === "ERC721") {
        const url = this.getHttpsUrlFromIpfs(nft.nft.metadata_url)
        console.log("url", url)
        try {
          console.log("nft.nft.metadata_url", nft.nft.metadata_url)
          const resi = await this.$axios.get(url, {baseURL: undefined});
          console.log("res from api ipfs", resi.data)
          const image_url = this.getHttpsUrlFromIpfs(resi.data.image)
          obj.image_url = image_url

        } catch (err) {

        }
      }
      nftsToDisplay.push(obj)
    }

    this.nfts = [...nftsToDisplay]

    this.loader = false;
  },
  methods: {
    async listNft(walledAddress) {
      console.log("list nft called")

      const res = await this.$axios.get(`/list-nft/${walledAddress}`);
      console.log("res from api", res.data)
      return res.data
    },

    getHttpsUrlFromIpfs(ipfsUrl) {
      return `https://ipfs.io/ipfs/${ipfsUrl.split("ipfs://")[1]}`;
    },
  }
}
</script>
