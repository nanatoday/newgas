import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors:{
          newgas: "#A5101B"
        }
      }
    }
  },
})

