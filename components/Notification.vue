<template>
</template>

<script>

export default {
  name: 'Notification',
  props: ['notif'],
  watch: {
    notif(n){
      if(n){
        this.$bvToast.toast(n.message, {
          title: n.title,
          variant: n.variant,
          solid: true,
          toaster: 'b-toaster-top-center',
        })
      }
    }
  },
};
</script>
