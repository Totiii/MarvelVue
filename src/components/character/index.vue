<template>
  <v-container fluid>
    <v-row>
      <v-col
          cols="12"
          sm="3"
          v-for="character in characters"
          :key="character.id">
        <CharacterCard :character="character"></CharacterCard>
      </v-col>
    </v-row>

    <Pagination :count="count" :handle-page-change="handlePageChange" :page="page"></Pagination>

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

      page: 1,
      count: 0,
    };
  },

  created() {
    this.fetchCharacters();
  },
  methods: {
    fetchCharacters() {
      let offset = (this.page - 1) * 8
      axios
          .get(`${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268&offset=`+ offset + `&limit=8`)
          .then(data => {
            this.characters = data.data.data.results
            console.log(data.data.data)
            this.count = Math.ceil(data.data.data.total / 8)
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
