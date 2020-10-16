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
                  v-model="inp_title"
                  @keyup="onSearchTitle()"
                  label="Title"
                ></v-text-field>
                <v-select
                    :items="comics_format"
                    v-model="slt_format"
                    @change="onSearchFormat()"
                    item-text="name"
                    item-value="url"
                    label="Type of format"
                ></v-select>

                <v-autocomplete
                    v-model="creators_model"
                    :items="creators"
                    :loading="isLoadingCreators"
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
                      <v-list-item-title v-if="0==0">
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
                        color="blue-grey"
                        class="white--text"
                        v-on="on"
                    >
                      <v-icon left>
                        mdi-bitcoin
                      </v-icon>
                      <span v-text="item.fullName"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.fullName"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <!--<v-autocomplete
                    v-model="model"
                    :items="characters"
                    :loading="isLoadingCharacters"
                    :search-input.sync="search_characters"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="fullName"
                    item-value="id"
                    label="Characters"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title v-if="0==0"> &lt;!&ndash; TODO faire la condition si il y a du text dans l'input&ndash;&gt;
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
                </v-autocomplete>-->

                <v-text-field
                    label="ISBN"
                ></v-text-field>
                <v-text-field
                    label="EAN"
                ></v-text-field>
                <v-text-field
                    label="ISSN"
                ></v-text-field>



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
          v-for="comics in comics_list.data.results"
          :key="comics.id">
        <ComicsCard :comics="comics"></ComicsCard>
      </v-col>
    </v-row>

    <Pagination v-if="!loading" :count="count" :handle-page-change="handlePageChange" :page="page"></Pagination>
    <Footer :loading="loading" :attributionText="comics_list.attributionText" :last_modified="''"></Footer>


      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import ComicsCard from "./comics_card";
import Pagination from "../pagination";
import Footer from "../footer";
let search_params = {};
export default {
  components: {
    ComicsCard,
    Pagination,
    Footer
  },
  data() {
    return {
      comics_list: [],
      loading: true,

      inp_title: "",
      slt_format: "",
      comics_format:[
          { name: 'Infinite comic', url: 'infinite%20comic' },
          { name: 'Comic', url: 'comic' },
          { name: 'Trade Paperback', url: 'trade%20paperback' },
          { name: 'Graphic Novel', url: 'graphic%20novel' },
          { name: 'Digest', url: 'digest' },
        ],

      isLoadingCreators: false,
      isLoadingCharacters: false,
      creators: [],
      creators_model: null,
      search_creators: null,


      page: 1,
      count: 0,
    };
  },

  watch: {
    search_creators (val) {
      this.isLoadingCreators = true
      // Lazily load input items
      fetch(`${server.baseURL}/public/creators?nameStartsWith=${val}&limit=30&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            this.creators = res.data.results
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoadingCreators = false))
    },
  },


  created() {
    this.fetchComics();
  },
  methods: {

    onSearchTitle(){
      if(this.inp_title && this.inp_title.length > 0){
        search_params["title"] = this.inp_title
      }else {
        delete search_params["title"]
      }
      this.fetchComics(search_params);
    },
    onSearchFormat(){
      console.log("format")
      console.log(this.slt_format)
      if(this.slt_format){
        search_params["format"] = this.slt_format
      }else {
        delete search_params["format"]
      }
      this.fetchComics(search_params);
    },

    fetchComics(filters={}) {
      this.loading = true
      let offset = (this.page - 1) * 8
      let url_request = `${server.baseURL}/public/comics?offset=${offset}&limit=9&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`
      if("title" in filters && filters["title"] !== ""){
        url_request+= `&titleStartsWith=${filters["title"]}`
      }
      if("format" in filters && filters["format"] !== ""){
        url_request+= `&format=${filters["format"]}`
      }
      if("characters" in filters && filters["characters"] !== ""){
        url_request+= `&characters=${filters["characters"]}`
      }
      if("isbn" in filters && filters["isbn"] !== ""){
        url_request+= `&isbn=${filters["isbn"]}`
      }
      if("ean" in filters && filters["ean"] !== ""){
        url_request+= `&ean=${filters["ean"]}`
      }
      if("issn" in filters && filters["issn"] !== ""){
        url_request+= `&issn=${filters["issn"]}`
      }

      axios
              .get(url_request)
              .then(data => {
                this.comics_list = data.data
                this.nbResults = data.data.data.total
                this.count = Math.ceil(data.data.data.total / 8)
              }).finally(() => {this.loading = false});
      },
    handlePageChange(value) {
      this.page = value;
      this.fetchComics();
    },


  }
};
</script>
