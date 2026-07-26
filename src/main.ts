import './assets/fonts.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

import App from './App.vue'

Chart.register(...registerables, annotationPlugin)

createApp(App).use(createPinia()).mount('#app')
