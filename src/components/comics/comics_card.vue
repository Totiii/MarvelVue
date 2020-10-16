<template>
  <v-card
      class="mx-auto my-12"
      max-width="374"
  >
    <v-img
        contain
        max-height="250"
        :src="comics.thumbnail.path + '.' + comics.thumbnail.extension"
    ></v-img>

    <v-card-title v-if="comics.title.length > 66">{{ comics.title.substring(0,63)+"..." }}</v-card-title>
    <v-card-title v-else>{{ comics.title }}</v-card-title>

    <v-card-text>
      <div
          v-if="comics.prices[0] && comics.prices[0].price > 0"
          class="my-4 subtitle-1"
      >
        $ {{ comics.prices[0].price }}
      </div>
      <div
          v-else
          class="my-4 subtitle-1"
      >
        No price
      </div>

      <div v-if="comics.description">{{comics.description.substring(0,330)+"..."}}</div>
      <div v-else>No description availiable</div>
    </v-card-text>


    <v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <router-link :to="'/comics/' + comics.id" tag="button">
      <v-btn
          block
          color="grey lighten-3 lighten-2"
          text
          block
      >
        Details
      </v-btn>
      </router-link>
    </v-card-actions>

  </v-card>
</template>
<script>
export default{
  props: ['comics'],
}
</script>
