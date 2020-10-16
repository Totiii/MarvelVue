<template>
  <v-card
      min-height="800"
      class="mx-auto"
  >
    <v-row class="justify-center">
      <v-col
          cols="12"
          sm="11"
          class="text-lg-center amber darken-3"
      >
        <h2>Events</h2>
      </v-col>
    </v-row>
    <v-carousel
        cycle
        hide-delimiter-background
        show-arrows-on-hover
        hide-delimiters
        height="800"
    >
      <v-carousel-item
          v-for="(event, i) in events"
          :key="i"
      >

        <v-card
            class="mx-auto"
            height="800"
        >
          <v-row>
            <v-col
                cols="12"
                sm="6"

            >
              <v-img
                  :src="event.thumbnail.path + '.' + event.thumbnail.extension"
                  contain
              >
              </v-img>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
              <div class="text--primary">
                {{ event.title }}
              </div>

              <v-card-text>
                <div>{{ event.description | limitDescription330Char }}</div>
              </v-card-text>

            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-subtitle class="pb-0">Related links</v-card-subtitle>

              <v-card-text class="text--primary">
                <div v-for="link in event.urls" :key="link.type"> <b>{{ link.type | capitalize }} </b>: <a :href="link.url" target="_blank">{{ link.url }}</a> </div>
              </v-card-text>
            </v-col>

            <v-card-text>
              <v-btn
                  block
                  color="grey lighten-3 lighten-2"
                  text
                  @click="$router.push({ name: 'EventsDetails', params: { id: event.id } })"
              >
                Details
              </v-btn>
            </v-card-text>
          </v-row>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>
<script>
export default{
  props: ['events'],
}
</script>
