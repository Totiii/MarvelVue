<template>

  <v-container fluid>

    <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>


    <div v-if="!loading">
      <v-card
          class="mx-auto"
      >
      <v-card-title>{{character.name}}</v-card-title>

      <v-card-subtitle class="pb-0">Description</v-card-subtitle>

      <v-card-text class="text--primary">
        <div>{{ character.description }}</div>
      </v-card-text>

      </v-card>


    </div>
    <v-footer
      absolute
      class="font-weight-medium"
      >
      <div>{{api_res.attributionText}} - Last update: {{character.modified}}</div>
    </v-footer>
  </v-container>



</template>
<script>
import { server } from "../../helper";
import axios from "axios";

export default {
  data() {
    return {
      character_id : this.$route.params.id,
      character: undefined,
      api_res: undefined,
      loading: true,
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    fetchCharacters() {
      axios
          .get(`${server.baseURL}/public/characters/${this.character_id}?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            console.log(data)
            this.character = data.data.data.results[0]
            this.api_res = data.data
            this.loading = false
          });
    },
  }
};
</script>
