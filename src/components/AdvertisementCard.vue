<template>
  <v-card>
    <v-img :src="ad.image" height="200px"></v-img>
    <v-card-title>{{ ad.title }}</v-card-title>
    <v-card-subtitle>{{ ad.price }}</v-card-subtitle>
    <v-card-text>{{ ad.description }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    ad: Object,
  },
};
</script>
