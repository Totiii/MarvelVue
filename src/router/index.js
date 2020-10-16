import Vue from 'vue'
import VueRouter from 'vue-router'
import CharacterIndex from '@/components/character/index.vue'
import CharacterDetails from '@/components/character/details.vue'
import Comics from '@/components/comics/index.vue'
import ComicsDetails from '@/components/comics/details.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Characters',
    component: CharacterIndex
  },
  {
    path: '/character/:id',
    name: 'CharacterDetails',
    component: CharacterDetails,
    props: true
  },

  {
    path: '/comics',
    name: 'ComicsAll',
    component: Comics,
  },
    {
    path: '/comics/:id',
    name: 'ComicsDetails',
    component: ComicsDetails,
    props: true
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
