<template>
  <div>
    <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        max-width="300"
        type="article"
    ></v-skeleton-loader>

    <v-card
        v-if="!loading"
        class="mx-auto"
    >
      <v-row class="justify-center">
        <v-col
            v-click-outside
            cols="12"
            sm="11"
            class="text-lg-center"
            :class="[color]"
        >
          <h2>{{ card_type }}</h2>
        </v-col>
      </v-row>
      <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
          hide-delimiters
          height="auto"
      >
        <v-carousel-item
            v-for="(data, i) in datas"
            :key="i"
        >

          <v-card
              class="mx-auto"
              height="auto"
          >
            <v-row>
              <v-col
                  cols="12"
                  sm="6"

              >
                <v-img
                    :src="data.thumbnail.path + '.' + data.thumbnail.extension"
                    contain
                >
                  <!-- TODO add computed -->
                </v-img>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
              >
                <div class="text--primary">
                  {{ data.title }}
                </div>

                <v-card-text>
                  <div v-if="data.description">{{ data.description | limitDescription330Char }}</div>
                  <div v-if="!data.description">No description avaiblable for {{data.title | capitalize}}</div>
                </v-card-text>

              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card-subtitle class="pb-0">Related links</v-card-subtitle>

                <v-card-text class="text--primary">
                  <div v-for="link in data.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
                </v-card-text>
              </v-col>

              <v-card-text>
                <v-btn
                    block
                    color="grey lighten-3 lighten-2"
                    text
                    @click="$router.push({ name:  url_name, params: { id: data.id } })"
                >
                  Details
                </v-btn>
              </v-card-text>
            </v-row>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </div>

</template>
<script>

export default{
  name: 'carousel',
  props: ['id', 'type', 'card_type', 'url_name', 'color'],
  data() {
    return {
      loading: true,
      datas: [],
    };
  },
}
</script>
