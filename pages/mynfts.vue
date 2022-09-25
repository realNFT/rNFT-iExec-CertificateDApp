<template>
  <div class="flex-column align-items-center justify-content-center">
    <Notification :notif="notif"/>
    <b-col cols="12" xl="12" sm="6">
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
  name: "oracle",
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
        image_url: '@/assets/images/image-equilibrium.jpg'
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

    // this.$axios.post("/existOracle", {
    //   form: th.form
    // })
    //   .then((resp) => {
    //     this.status = resp.data.status
    //     this.oracleId = resp.data.id ? resp.data.id : null
    //
    //     if (resp.data.id)
    //       this.readOracle()
    //
    //     this.loading = false
    //   })
    //   .catch((err) => {
    //     console.log(err.response.data)
    //     this.notif = {
    //       title: "Error",
    //       variant: "danger",
    //       message: err.response.data.message
    //     }
    //     this.loading = false
    //   })
  },
  // created() {
  //   console.log("hello I'm created")
  // },
  watch: {
    'form.smartContract'(n) {
      let temp = mapState(['form'])
      if (/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract)) {
        console.log(temp)
        temp.smartContract = n
        temp.tokenId = this.form.tokenId
        this.valid.smartContract = true
        this.$store.commit("setDataForm", temp)
      } else {
        temp.smartContract = ""
        temp.tokenId = this.form.tokenId
        this.valid.smartContract = false
        this.$store.commit("setDataForm", temp)
      }

    },
    'form.tokenId'(n) {
      let temp = mapState(['form'])
      if (/^[0-9]+$/.test(this.form.tokenId) && this.form.tokenId >= 0) {
        temp.smartContract = this.form.smartContract
        temp.tokenId = n

        this.valid.tokenId = true
      } else {
        temp.smartContract = this.form.smartContract
        temp.tokenId = ""
        this.valid.tokenId = false
      }
      this.$store.commit("setDataForm", temp)
    }
  },
  methods: {
    checkExisting() {
      if (/^0x[a-fA-F0-9]{40}$/.test(this.form.smartContract) && /^[0-9]+$/.test(this.form.tokenId))
        this.existOracle()
    },
    createOracle() {
      this.loading = true
      this.$axios.post("/createOracle", {
        form: this.form
      })
        .then((resp) => {

          this.notif = {
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
    existOracle() {
      this.value = null
      this.oracleId = null
      this.loading = true
      this.$axios.post("/existOracle", {
        form: this.form
      })
        .then((resp) => {
          this.status = resp.data.status
          this.oracleId = resp.data.id ? resp.data.id : null

          if (resp.data.id)
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

    async listNft(walledAddress) {
      console.log("list nft called")

      const res = await this.$axios.get(`/list-nft/${walledAddress}`);
      console.log("res from api", res.data)
      return res.data
    },

    getHttpsUrlFromIpfs(ipfsUrl) {
      return `https://ipfs.io/ipfs/${ipfsUrl.split("ipfs://")[1]}`;
    },

    readOracle() {
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
    updateOracle() {
      this.loading = true
      this.$axios.post("/updateOracle", {
        form: this.form
      })
        .then((resp) => {
          this.notif = {
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
