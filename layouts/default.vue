<template>
    <div style="min-height: 90vh;">
        <Navbar/>
        <b-container class="mt-5">
            <b-card class="bg-cutsom" style="min-height: 40vh;">
                <nuxt/>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"

export default {
    name: "Default",
    data(){
        return{
            notif: null,
        }
    },
    components: {
        Navbar,
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

    @keyframes gradient {
        0%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0% 50%;
        }
    }

    .bg-cutsom{
        background: linear-gradient(-45deg, var(--pink), var(--purple), var(--blue));
        background-size: 400% 400%;
        animation: gradient 10s ease infinite;
        box-shadow: 2px 2px 4px var(--blue);
    }

</style>