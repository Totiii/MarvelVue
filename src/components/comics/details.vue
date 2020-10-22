<template>

  <v-container fluid>

    <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>
    <v-alert
        v-if="errorFetch"
        type="warning"
    >An error has occurred: {{this.errorFetch.response.data.status}}</v-alert>

    <v-row>
      <v-card
          v-if="!loading && !errorFetch"
          class="mx-auto d-inline-block mb-10"
      >
        <v-row class="ml-2">
          <v-col
              cols="12"
              sm="3"
          >
            <v-img :src="comic.thumbnail.path + '.' + comic.thumbnail.extension" contain></v-img>
          </v-col >
          <v-col
              cols="12"
              sm="6"
          >
            <v-card-title>{{comic.title | capitalize}}</v-card-title>

            <v-card-subtitle class="pb-0">Description</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-if="comic.description">{{ comic.description }}</div>
              <div v-if="!comic.description">No description avaiblable for {{comic.title | capitalize}}</div>
            </v-card-text>

            <v-card-subtitle class="pb-0">Prices</v-card-subtitle>

            <v-card-text class="text--primary">
              <div
                  v-if="comic.prices[0] && comic.prices[0].price > 0"
                  class="my-4 subtitle-1"
              >
                $ {{ comic.prices[0].price }}
              </div>
              <div
                  v-else
                  class="my-4 subtitle-1"
              >
                No price
              </div>
            </v-card-text>

            <div v-if="creator">
              <v-card-title>Creator: <router-link :to="({ name: 'CreatorDetails', params: { id: creator.id } })" tag="button"> {{ creator.fullName }}</router-link></v-card-title>

              <v-card-subtitle class="pb-0">Related links</v-card-subtitle>

              <v-card-text class="text--primary">
                <div v-for="link in creator.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
              </v-card-text>
            </div>

            <v-card-subtitle class="pb-0">Useful links</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="link in comic.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row class="justify-center">
      <v-col
          cols="12"
          sm="10"
      >
        <CharacterTable v-if="!loading && !errorFetch" :type="'comics'" :id="comics_id" :charactersnb="comic.characters.available"></CharacterTable>
      </v-col>
    </v-row>



    <v-footer
        v-if="!loading && !errorFetch"
        absolute
        class="font-weight-medium"
    >
      <div>{{api_res.attributionText}} - Last update: {{comic.modified}}</div>
    </v-footer>
  </v-container>



</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import CharacterTable from "../character/character_table"

export default {
  components: {
    CharacterTable
  },
  data() {
    return {
      comics_id : this.$route.params.id,
      comic: undefined,
      api_res: undefined,
      loading: true,
      creator: undefined,
      errorFetch:null
    };
  },
  created() {
    this.fetchComics();
  },
  computed:{
    url: function (path, extension) {
      return path + '.' + extension
    }
  },
  methods: {
    async fetchComics() {
      // get comic data
      this.errorFetch = null;
      await axios
          .get(`${server.baseURL}/public/comics/${this.comics_id}?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.comic = data.data.data.results[0]
            this.api_res = data.data
          }).catch(err => {this.errorFetch = err});
      // get creators data
      await axios
          .get(`${server.baseURL}/public/comics/${this.comics_id}/creators?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.creator = data.data.data.results[0]
          }).catch(err => {this.errorFetch = err})
          .finally(() => {
            this.loading = false
          });
    },
  }
};
</script>
