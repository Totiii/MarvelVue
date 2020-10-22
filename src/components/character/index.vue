<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="9">
          <v-text-field
              v-model="inp_name"
              @keyup="onSearchName()"
              label="Filter by name"
              outlined
              shaped
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="9">
        <v-row v-if="loading">
          <v-col
              cols="12"
              sm="4"
              v-for="n in 9"
              :key="n">
            <v-skeleton-loader
                class="mx-auto"
                type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-alert
            v-if="!loading && characters.length < 1"
            type="info"
        >No characters to display</v-alert>

        <v-row v-if="!loading">
          <v-col
              cols="12"
              sm="4"
              v-for="character in characters"
              :key="character.id">
            <CharacterCard :character="character"></CharacterCard>
          </v-col>
        </v-row>

        <Pagination v-if="!loading" :count="count" :handle-page-change="handlePageChange" :page="page"></Pagination>
        <Footer :loading="loading" :attributionText="characters.attributionText" :last_modified="''"></Footer>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import CharacterCard from "./character_card";
import Pagination from "../pagination";
import Footer from "../footer";
let search_params = {};
export default {
  components: {
    CharacterCard,
    Pagination,
    Footer
  },
  data() {
    return {
      characters: [],
      loading: true,
      nbResults: 0,
      allCharacters: [],

      inp_name:"",

      page: 1,
      count: 0,

      descriptionLimit: 60,
      entries: [],
    };
  },



  created() {
    this.fetchCharacters();
  },
  methods: {
    onSearchName(){
      if(this.inp_name && this.inp_name.length > 0){
        search_params["name"] = encodeURIComponent(this.inp_name)
      }else {
        delete search_params["name"]
      }
      this.fetchCharacters(search_params);
    },


    fetchCharacters(filters={}) {
      this.loading = true
      let offset = (this.page - 1) * 8

      let url_request = `${server.baseURL}/public/characters?offset=${offset}&limit=9&${server.apikey}`
      if("name" in filters && filters["name"] !== ""){
        url_request+= `&nameStartsWith=${filters["name"]}`
      }

      axios
        .get(url_request)
        .then(data => {
          this.characters = data.data.data.results
          this.nbResults = data.data.data.total
          this.count = Math.ceil(data.data.data.total / 8)

        }).finally(()=>{this.loading = false});
    },


    handlePageChange(value) {
      this.page = value;
      this.fetchCharacters(search_params);
    },
  },
};
</script>
