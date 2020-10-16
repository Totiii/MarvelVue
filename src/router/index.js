import Vue from 'vue'
import VueRouter from 'vue-router'
import CharacterIndex from '@/components/character/index'
import CharacterDetails from '@/components/character/details'
import Events from '@/components/events/index'
import EventDetail from '@/components/events/details'
import Series from '@/components/series/index'
import SerieDetail from '@/components/series/details'
import Comics from '@/components/comics/index'
import ComicsDetails from '@/components/comics/details'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CharacterIndex
  },
  {
    path: '/character/:id',
    name: 'CharacterDetails',
    component: CharacterDetails,
    props: true
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
  },
  {
    path: '/events/:id',
    name: 'EventsDetails',
    component: EventDetail,
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
  {
    path: '/series',
    name: 'Series',
    component: Series,
  },
  {
    path: '/series/:id',
    name: 'SerieDetail',
    component: SerieDetail,
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
