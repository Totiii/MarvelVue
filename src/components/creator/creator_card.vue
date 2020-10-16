<template>
  <v-card
      class="mx-auto my-12"
      max-width="374"
  >
    <v-img
        contain
        max-height="250"
        :src="creator.thumbnail.path + '.' + creator.thumbnail.extension"
    ></v-img>

    <v-card-title>{{ creator.fullName }}</v-card-title>

    <v-card-text>
      <div v-if="creator.description">{{creator.description.substring(0,330)+"..."}}</div>
      <div v-else>No description availiable</div>
    </v-card-text>


    <v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <router-link :to="'/creators/' + creator.id" tag="button">
        <v-btn
            block
            color="grey lighten-3 lighten-2"
            text
        >
          Details
        </v-btn>
      </router-link>
    </v-card-actions>

  </v-card>
</template>
<script>
export default{
  props: ['creator'],
}
</script>
