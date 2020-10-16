<template>

  <v-container fluid>

    <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>
    <v-row>
      <v-card
          v-if="!loading"
          class="mx-auto d-inline-block mb-10"
      >
        <v-row class="ml-2">
          <v-col
              cols="12"
              sm="3"
          >
            <v-img :src="serie.thumbnail.path + '.' + serie.thumbnail.extension" contain></v-img>
          </v-col >
          <v-col
              cols="12"
              sm="6"
          >
            <v-card-title>{{serie.title | capitalize}}</v-card-title>

            <v-card-subtitle class="pb-0">Description</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-if="serie.description">{{ serie.description }}</div>
              <div v-if="!serie.description">No description avaiblable for {{serie.title | capitalize}}</div>
            </v-card-text>

            <v-card-subtitle class="pb-0">Useful links</v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="link in serie.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-row>


    <v-row class="ml-2 mb-10">

      <v-col
          cols="12"
          sm="4"
      >
      </v-col>
      <v-col
          cols="12"
          sm="4"
      >
      </v-col>
      <v-col
          cols="12"
          sm="4"
      >
      </v-col>

    </v-row>



    <v-footer
        v-if="!loading"
        absolute
        class="font-weight-medium"
    >
      <div>{{api_res.attributionText}} - Last update: {{serie.modified}}</div>
    </v-footer>
  </v-container>

</template>
<script>
import { server } from "../../helper";
import axios from "axios";

export default {
  data() {
    return {
      serie_id : this.$route.params.id,
      serie: undefined,
      api_res: undefined,
      loading: true,
      comics: [],
      characters: [],
      creators: [],
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
      // get serie data
      await axios
          .get(`${server.baseURL}/public/series/${this.serie_id}?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.serie = data.data.data.results[0]
            this.api_res = data.data
            this.loading = false
            console.log(this.serie)
          });
    },
  }
};
</script>
