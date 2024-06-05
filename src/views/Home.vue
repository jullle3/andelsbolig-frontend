<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            label="Search"
            v-model="query"
            @keyup.enter="handleSearch"
        ></v-text-field>
        <v-btn @click="handleSearch">Search</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
          v-for="(ad, index) in ads"
          :key="index"
          cols="12"
          md="4"
      >
        <AdvertisementCard :ad="ad" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { fetchAdvertisements } from '@/services/api';
import AdvertisementCard from '../components/AdvertisementCard.vue';

export default {
  components: {
    AdvertisementCard,
  },
  data() {
    return {
      query: '',
      ads: [],
    };
  },
  methods: {
    async handleSearch() {
      this.ads = await fetchAdvertisements(this.query);
    },
  },
};
</script>
