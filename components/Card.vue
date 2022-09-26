<template>
  <article class="card-nft">
    <div class="card__picture-container">
      <img :src="image_url ?? getImgUrl('images/no-image.jpg')" alt="nft image" class="card__picture">
    </div>
      <h1 class="card__title">{{ name }} #{{token_id}}</h1>
  </article>
</template>

<script>
import '../assets/css/main.scss'

export default {
  name: "Card",
  props: {
    name: String,
    token_id: String,
    image_url: String
  },
  methods: {
    getImgUrl(pet) {
      return require('../assets/'+pet)
    }
  }
}
</script>
