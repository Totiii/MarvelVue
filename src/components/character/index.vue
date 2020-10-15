<template>
  <v-container fluid>

    <div class="input-group mb-3">
      <input
          type="text"
          class="form-control"
          placeholder="Search by title"
          v-model="searchTitle"
      />
      <div class="input-group-append">
        <button
            class="btn btn-outline-secondary"
            type="button"
            @click="page = 1; fetchCharacters();"
        >
          Search
        </button>
      </div>
    </div>

    <v-row>
      <v-col
          cols="12"
          sm="3"
          v-for="character in characters"
          :key="character.id">
        <CharacterCard :character="character"></CharacterCard>
      </v-col>
    </v-row>

    <v-pagination
        v-model="page"
        :length="count"
        @change="handlePageChange"
    ></v-pagination>

  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import CharacterCard from "./character_card";

export default {
  components: {
    CharacterCard
  },
  data() {
    return {
      characters: [],
      loading: true,

      searchTitle: "",

      page: 1,
      count: 0,
    };
  },

  created() {
    this.fetchCharacters();
  },
  methods: {
/*    fetchCharacters() {
      axios
          .get(`${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.characters = data.data.data.results
            this.loading = false
          });
    },*/

    getRequestParams(searchTitle, page) {
      let params = '';

      if (searchTitle) {
        params += "&name=" + searchTitle;
      }

      if (page) {
        params += "&page=" + page - 1;
      }

      return params;
    },

    fetchCharacters() {
      const params = this.getRequestParams(
          this.searchTitle,
          this.page,
      );

      let url
      if(params){
        console.log(params)
        url = `${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268` + params
      }else{
        url = `${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`
      }

      axios
          .get(url)
          .then(data => {
            this.characters = data.data.data.results
            this.count = Math.ceil(data.data.data.results.length / 8)
            this.loading = false
          });

    },

    handlePageChange(value) {
      this.page = value;
      this.fetchCharacters();
    },
  }
};
</script>
