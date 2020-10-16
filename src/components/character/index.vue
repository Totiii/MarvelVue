<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" >

        <v-navigation-drawer
            permanent
            width="100%"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Filter characters
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list
              dense
              nav
          >
            <v-list-item>


              <v-list-item-content>
                <v-text-field
                    label="Name"
                ></v-text-field>
                <v-autocomplete
                    v-model="model"
                    :items="comics"
                    :loading="isLoadingComics"
                    :search-input.sync="search_comics"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="fullName"
                    item-value="id"
                    label="Comics"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title v-if="0==0"> <!-- TODO faire la condition si il y a du text dans l'input-->
                        No data try another search
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        Start type to search a creator
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ attr, on, item, selected }">
                    <v-chip
                        v-bind="attr"
                        :input-value="selected"
                        v-on="on"
                    >
                      <span v-text="item.fullName"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.fullName"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>

              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

      </v-col>

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
      </v-col>
    </v-row>
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
          .get(`${server.baseURL}/public/characters?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268&offset=`+ offset + `&limit=9`)
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
