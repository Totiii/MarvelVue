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
                Filter creators
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                    v-model="inp_name"
                    @keyup="onSearchName()"
                    label="Name"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>

                <v-autocomplete
                    v-model="atc_comics"
                    :items="comics"
                    :loading="isLoadingComics"
                    :search-input.sync="search_comics"
                    @change="onSearchComics()"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="title"
                    item-value="id"
                    label="Work on comics"
                    multiple
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        Start type to search a comics
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeComicsChips(data.item)"
                    >
                      <span v-text="data.item.title"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
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

        <v-alert
            v-if="!loading && creators.data.results.length < 1"
            type="info"
        >No creators to display</v-alert>


        <v-row v-if="!loading">
          <v-col
              cols="12"
              sm="4"
              v-for="creator in creators.data.results"
              :key="creator.id">
            <CreatorCard :creator="creator"></CreatorCard>
          </v-col>
        </v-row>

        <Pagination v-if="!loading" :count="count" :handle-page-change="handlePageChange" :page="page"></Pagination>


        <Footer :loading="loading" :attributionText="creators.attributionText" :last_modified="''"></Footer>


      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import CreatorCard from "./creator_card";
import Pagination from "../pagination";
import Footer from "../footer";
let search_params = {};
export default {
  components: {
    CreatorCard,
    Pagination,
    Footer
  },
  data() {
    return {
      loading: true,
      creators: [],

      isLoadingComics: false,
      comics: [],
      inp_name:"",
      atc_comics: null,
      search_comics: null,

      page: 1,
      count: 0,
    };
  },

  watch: {
    search_comics (val) {
      this.isLoadingComics = true
      let enc_val = encodeURIComponent(val);
      fetch(`${server.baseURL}/public/comics?titleStartsWith=${enc_val}&limit=10&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            res.data.results.forEach(result => {
              this.comics.push(result)
            });
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoadingComics = false))
    },
  },

  created() {
    this.fetchCreators();
  },
  methods: {

    onSearchName(){
      if(this.inp_name && this.inp_name.length > 0){
        search_params["name"] = encodeURIComponent(this.inp_name)
      }else {
        delete search_params["name"]
      }
      this.fetchCreators(search_params);
      console.log(search_params)
    },
    onSearchComics(){
      if(this.atc_comics){
        search_params["comics"] = encodeURIComponent(this.atc_comics)
      }else {
        delete search_params["comics"]
      }
      this.fetchCreators(search_params);
    },


    // eslint-disable-next-line no-unused-vars
    fetchCreators(filters={}) {


      this.loading = true
      let offset = (this.page - 1) * 8


      let url_request = `${server.baseURL}/public/creators?offset=${offset}&limit=9&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`
      if("name" in filters && filters["name"] !== ""){
        url_request+= `&nameStartsWith=${filters["name"]}`
      }
      if("comics" in filters && filters["comics"] !== ""){
        url_request+= `&comics=${filters["comics"]}`
      }
      axios
          .get(url_request)
          .then(data => {
            this.creators = data.data
            this.nbResults = data.data.data.total
            this.count = Math.ceil(data.data.data.total / 8)
          }).finally(() => {this.loading = false});
    },


    removeComicsChips (item) {
      const index = this.atc_comics.indexOf(item.id)
      if (index >= 0) this.atc_comics.splice(index, 1)
      this.onSearchComics();
    },

    handlePageChange(value) {
      this.page = value;
      this.fetchCreators(search_params);
    },

  }
};
</script>
