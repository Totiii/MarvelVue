<template>

  <v-container fluid>

    <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>

    <div v-if="!loading">
      <v-card
          class="mx-auto d-inline-block mb-10"
      >
        <v-row class="ml-2">
          <v-col
              cols="12"
              sm="3"
          >
            <v-img :src="character.thumbnail.path + '.' + character.thumbnail.extension" contain></v-img>
          </v-col >
          <v-col
              cols="12"
              sm="9"
            >
            <v-card-title>{{character.name | capitalize}}</v-card-title>

            <v-card-subtitle class="pb-0">Description</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-if="character.description">{{ character.description }}</div>
              <div v-if="!character.description">No description avaiblable for {{character.name | capitalize}}</div>
            </v-card-text>

            <v-card-subtitle class="pb-0">Useful links</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="link in character.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="ml-2">
          <v-col
              cols="12"
              sm="4"
          >
            <ComicsCarousel :comics="comics"></ComicsCarousel>

          </v-col>
          <v-col
              cols="12"
              sm="4"
          >

            <v-carousel
                cycle
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
                hide-delimiters
            >
              <v-carousel-item
                  v-for="(serie, i) in series"
                  :key="i"
              >
              </v-carousel-item>
            </v-carousel>

          </v-col>
          <v-col
              cols="12"
              sm="4"
          >

            <v-carousel
                cycle
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
                hide-delimiters
            >
              <v-carousel-item
                  v-for="(storie, i) in stories"
                  :key="i"
              >
              </v-carousel-item>
            </v-carousel>

          </v-col>
        </v-row>

      </v-card>


    </div>
    <v-footer
      absolute
      class="font-weight-medium"
      >
      <div>{{api_res.attributionText}} - Last update: {{character.modified}}</div>
    </v-footer>
  </v-container>



</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import ComicsCarousel from "../comics/comics_carousel";

export default {
  components: {
    ComicsCarousel,
  },
  data() {
    return {
      character_id : this.$route.params.id,
      character: undefined,
      api_res: undefined,
      loading: true,
      comics: [],
/*      events: [],*/
      series: [],
      stories: [],
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      // get character data
      await axios
          .get(`${server.baseURL}/public/characters/${this.character_id}?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            console.log(data.data.data.results[0])
            this.character = data.data.data.results[0]
            this.api_res = data.data
          });
      // get character comics
      await axios
          .get(`${server.baseURL}/public/characters/${this.character_id}/comics?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.comics = data.data.data.results
            console.log(this.comics)
          });
      // get character events
/*      await axios
          .get(`${server.baseURL}/public/characters/${this.character_id}/events?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.events = data.data.data.results
          });*/
      // get character series
      await axios
          .get(`${server.baseURL}/public/characters/${this.character_id}/series?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.series = data.data.data.results
          });
      // get character stories
      await axios
          .get(`${server.baseURL}/public/characters/${this.character_id}/stories?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.series = data.data.data.results
            this.loading = false
          });
    },
  }
};
</script>
