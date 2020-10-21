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

          <v-list dense nav>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  v-model="inp_title"
                  @keyup="onSearchTitle()"
                  label="Title"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-select
                    :items="comics_format"
                    v-model="slt_format"
                    @change="onSearchFormat()"
                    item-text="name"
                    item-value="url"
                    label="Type of format"
                ></v-select>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-autocomplete
                    v-model="atc_creators"
                    :items="creators"
                    :loading="isLoadingCreators"
                    :search-input.sync="search_creators"
                    @change="onSearchCreators()"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="fullName"
                    item-value="id"
                    label="Creators"
                    multiple
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title v-if="0== 0">
                        No data try another search
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        Start type to search a creator
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeCreatorsChips(data.item)"
                    >
                      <span v-text="data.item.fullName"></span>
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

            <v-list-item>
              <v-list-item-content>
                <v-autocomplete
                    v-model="atc_characters"
                    :items="characters"
                    :loading="isLoadingCharacters"
                    :search-input.sync="search_characters"
                    @change="onSearchCharacters()"
                    chips
                    clearable
                    hide-details
                    hide-selected
                    item-text="name"
                    item-value="id"
                    label="Characters"
                    multiple
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        Start type to search a characters
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeCharactersChips(data.item)"
                    >
                      <span v-text="data.item.name"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-text-field
                    v-model="inp_isbn"
                    @keyup="onSearchISBN()"
                    label="ISBN"
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
      inp_isbn: "",
      comics_format:[
          { name: 'All', url: '' },
          { name: 'Infinite comic', url: 'infinite%20comic' },
          { name: 'Comic', url: 'comic' },
          { name: 'Trade Paperback', url: 'trade%20paperback' },
          { name: 'Graphic Novel', url: 'graphic%20novel' },
          { name: 'Digest', url: 'digest' },
        ],

      isLoadingCreators: false,
      isLoadingCharacters: false,
      creators: [],
      atc_creators: null,
      search_creators: null,
      characters: [],
      atc_characters: null,
      search_characters: null,
      page: 1,
      count: 0,


    };
  },

  watch: {
    search_creators (val) {
      //if (this.creators.length > 0) return
      this.isLoadingCreators = true
      let enc_val = encodeURIComponent(val);
      console.log(enc_val)
      fetch(`${server.baseURL}/public/creators?nameStartsWith=${enc_val}&limit=10&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            res.data.results.forEach(result => {
              this.creators.push(result)
            });
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoadingCreators = false))
    },

    search_characters (val) {
     // if (this.characters.length > 0) return
      this.isLoadingCharacters = true
      let enc_val = encodeURIComponent(val);
      fetch(`${server.baseURL}/public/characters?nameStartsWith=${enc_val}&limit=10&ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(res => res.clone().json())
          .then(res => {
            res.data.results.forEach(result => {
              this.characters.push(result)
            });
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoadingCharacters = false))
    },


  },


  created() {
    this.fetchComics();
  },
  methods: {

    onSearchTitle(){
      if(this.inp_title && this.inp_title.length > 0){
        search_params["title"] = encodeURIComponent(this.inp_title)
      }else {
        delete search_params["title"]
      }
      this.fetchComics(search_params);
    },
    onSearchFormat(){
      console.log("format")
      console.log(this.slt_format)
      if(this.slt_format){
        search_params["format"] = encodeURIComponent(this.slt_format)
      }else {
        delete search_params["format"]
      }
      this.fetchComics(search_params);
    },
    onSearchCreators(){
      if(this.atc_creators){
        search_params["creators"] = encodeURIComponent(this.atc_creators)
      }else {
        delete search_params["creators"]
      }
      this.fetchComics(search_params);
    },
    onSearchCharacters(){
      if(this.atc_characters){
        search_params["characters"] = encodeURIComponent(this.atc_characters)
      }else {
        delete search_params["characters"]
      }
      this.fetchComics(search_params);
    },
    onSearchISBN(){
      if(this.inp_isbn && this.inp_isbn.length > 0){
        search_params["isbn"] = encodeURIComponent(this.inp_isbn)
      }else {
        delete search_params["isbn"]
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
      if("creators" in filters && filters["creators"] !== ""){
        url_request+= `&creators=${filters["creators"]}`
      }
      if("characters" in filters && filters["characters"] !== ""){
        url_request+= `&characters=${filters["characters"]}`
      }
      if("isbn" in filters && filters["isbn"] !== ""){
        url_request+= `&isbn=${filters["isbn"]}`
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

    removeCharactersChips (item) {
      const index = this.atc_characters.indexOf(item.id)
      if (index >= 0) this.atc_characters.splice(index, 1)
      this.fetchComics(search_params)
    },
    removeCreatorsChips (item) {
      const index = this.atc_creators.indexOf(item.id)
      if (index >= 0) this.atc_creators.splice(index, 1)
      this.fetchComics(search_params)
    },

  }
};
</script>
