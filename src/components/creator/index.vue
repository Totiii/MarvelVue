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
                    v-model="slc_comics_models"
                    :items="comics"
                    :loading="isLoadingComics"
                    :search-input.sync="search_comics"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="title"
                    item-value="id"
                    label="Work on comics"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title v-if="0==0">
                        No data try another search
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        Start type to search a comics
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ attr, on, item, selected }">
                    <v-chip
                        v-bind="attr"
                        :input-value="selected"
                        color="blue-grey"
                        class="white--text"
                        v-on="on"
                    >
                      <v-icon left>
                        mdi-bitcoin
                      </v-icon>
                      <span v-text="item.title"></span>
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
      slc_comics_models: null,
      search_comics: null,

      page: 1,
      count: 0,
    };
  },

  watch: {
    search_comics (val) {
      this.isLoadingComics = true
      // Lazily load input items
      fetch(`${server.baseURL}/public/comics?titleStartsWith=${val}&limit=10&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            this.comics = res.data.results
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
      console.log(encodeURI(this.inp_name))

      if(this.inp_name && this.inp_name.length > 0){
        search_params["name"] = encodeURIComponent(this.inp_name)
      }else {
        delete search_params["name"]
      }
      this.fetchCreators(search_params);
      console.log(search_params)
    },


    // eslint-disable-next-line no-unused-vars
    fetchCreators(filters={}) {


      this.loading = true
      let offset = (this.page - 1) * 8


      let url_request = `${server.baseURL}/public/creators?offset=${offset}&limit=9&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`
      if("name" in filters && filters["name"] !== ""){
        url_request+= `&nameStartsWith=${filters["name"]}`
      }
      axios
          .get(url_request)
          .then(data => {
            this.creators = data.data
            this.nbResults = data.data.data.total
            this.count = Math.ceil(data.data.data.total / 8)
          }).finally(() => {this.loading = false});
    },
    handlePageChange(value) {
      this.page = value;
      this.fetchCreators();
    },


  }
};
</script>
