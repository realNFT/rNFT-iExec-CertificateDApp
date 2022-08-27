<template>
    <div>
        <Navbar/>
        <nuxt/>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"

export default {
    name: "Default",
    components: {
        Navbar
    }
}
</script>

<style>
    ::selection {
        background: var(--yellow);
        color: #0d0d12;
    }

    html * {
        font-family: "Barlow" !important;
    }
    body{
        color: white;
        background-color: #0d0d12;
    }
    
</style>