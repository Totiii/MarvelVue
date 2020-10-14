<template>
  <v-container fluid>

    <v-skeleton-loader
            v-if="loading"
            class="mx-auto"
            max-width="374"
            type="image, card-heading, text@3, button"
    ></v-skeleton-loader>


    <div v-for="character in characters" :key="character.id">
      <v-card
          class="mx-auto my-12"
          max-width="374"
      >
        <v-img
            height="250"
            :src="character.thumbnail.path + '.' + character.thumbnail.extension"
        ></v-img>

        <v-card-title>{{ character.name }}</v-card-title>

        <v-card-text>
          <div>{{ character.description }}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-btn
              color="grey lighten-3 lighten-2"
              text
          >
            Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";

export default {
  data() {
    return {
      characters: [],
      loading: true,
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    fetchCharacters() {
      axios
          .get(`${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.characters = data.data.data.results
            this.loading = false
          });
    },
  }
};
</script>
