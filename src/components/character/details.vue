<template>

  <v-container fluid>

    <v-skeleton-loader
        v-if="loading_character"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>

    <v-card
        v-if="!loading_character"
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
    </v-card>

      <v-row class="ml-2 mb-10">
        <!-- Comics Carousel -->
        <v-col
            cols="12"
            sm="4"
        >
          <ComicsCarousel :id="character_id" :type="'characters'" :url_name="'ComicsDetails'" :card_type="'Comics'" :color="'orange darken-3'"></ComicsCarousel>
        </v-col>

        <!-- Series Carousel -->
        <v-col
            cols="12"
            sm="4"
        >
          <SeriesCarousel :id="character_id" :type="'characters'" :url_name="'SerieDetail'" :card_type="'Series'" :color="'indigo darken-3'"></SeriesCarousel>
        </v-col>

        <!-- Events Carousel -->
        <v-col
            cols="12"
            sm="4"
        >
          <EventsCarousel :id="character_id" :type="'characters'" :url_name="'EventsDetails'" :card_type="'Events'" :color="'amber darken-3'"></EventsCarousel>
        </v-col>
      </v-row>


    <v-footer
        v-if="!loading_character"
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
import SeriesCarousel from "../series/series_carousel";
import EventsCarousel from "../events/events_carousel";

export default {
  components: {
    EventsCarousel,
    ComicsCarousel,
    SeriesCarousel,
  },
  data() {
    return {
      character_id : this.$route.params.id,
      character: undefined,
      api_res: undefined,
      loading_character: true,
      comics: [],
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
            this.character = data.data.data.results[0]
            this.api_res = data.data
            this.loading_character = false
          });
    },
  }
};
</script>
