<template>
  <v-container fluid>

    <v-row v-if="loading">
      <v-col
          cols="12"
          sm="3"
          v-for="n in 8"
          :key="n">
        <v-skeleton-loader
            class="mx-auto"
            type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col
          cols="12"
          sm="3"
          v-for="character in characters"
          :key="character.id">
        <CharacterCard :character="character"></CharacterCard>
      </v-col>
    </v-row>

    <Pagination v-if="!loading" :count="count" :handle-page-change="handlePageChange" :page="page"></Pagination>

  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import CharacterCard from "./character_card";
import Pagination from "../pagination";

export default {
  components: {
    CharacterCard,
    Pagination
  },
  data() {
    return {
      characters: [],
      loading: true,
      nbResults: 0,
      allCharacters: [],

      page: 1,
      count: 0,

      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
    };
  },

  created() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      this.loading = true
      let offset = (this.page - 1) * 8

      await axios
          .get(`${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268&offset=`+ offset + `&limit=8`)
          .then(data => {
            this.characters = data.data.data.results
            this.nbResults = data.data.data.total
            this.count = Math.ceil(data.data.data.total / 8)
            this.loading = false
          });
    },

    handlePageChange(value) {
      this.page = value;
      this.fetchCharacters();
    },
  },
};
</script>
