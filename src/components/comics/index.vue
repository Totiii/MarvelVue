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
                Filter comics
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
                    label="Title"
                ></v-text-field>
                <v-select
                    :items="comics_format"
                    item-text="name"
                    item-value="url"
                    label="Type of format"
                ></v-select>
                <v-text-field
                    label="ISBN"
                ></v-text-field>


                <v-autocomplete
                    v-model="model"
                    :items="creators"
                    :loading="isLoading"
                    :search-input.sync="search_creators"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="fullName"
                    item-value="id"
                    label="Creators"
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
            max-width="300"
            type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>


    <v-row v-if="!loading">
      <v-col
          cols="12"
          sm="4"
          v-for="comics in comics_list"
          :key="comics.id">
        <ComicsCard :comics="comics"></ComicsCard>
      </v-col>
    </v-row>

    <v-pagination
        v-if="!loading"
        v-model="page"
        :length="count"
        @change="handlePageChange"
    ></v-pagination>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import ComicsCard from "./comics_card";

export default {
  components: {
    ComicsCard
  },
  data() {
    return {
      comics_list: [],
      loading: true,
      comics_format:[
          { name: 'Infinite comic', url: 'infinite%20comic' },
          { name: 'Comic', url: 'comic' },
          { name: 'Trade Paperback', url: 'trade%20paperback' },
          { name: 'Graphic Novel', url: 'graphic%20novel' },
          { name: 'Digest', url: 'digest' },
        ],

      isLoading: false,
      items: [],
      creators: [],
      model: null,
      search_creators: null,
      tab: null,
    };
  },

  watch: {
    model (val) {
      if (val != null) this.tab = 0
      else this.tab = null
    },
    search_creators (val) {
      console.log(val)
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      fetch(`${server.baseURL}/public/creators?nameStartsWith=${val}&limit=30&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            console.log(res)
            this.creators = res.data.results
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
    },
  },


  created() {
    this.fetchComics();
  },
  methods: {

   /* fetchComics(title="", creators="", characters="", format="", isbn="", ean="", issn="") {*/
    fetchComics() {
          axios
              .get(`${server.baseURL}/public/comics?limit=9&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
              .then(data => {
                this.comics_list = data.data.data.results
                this.loading = false
              });
        },

 /*   getRequestParams(searchTitle, page) {
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
    },*/
  }
};
</script>
