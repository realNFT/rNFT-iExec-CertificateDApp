export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  serverMiddleware: ['~/server-middleware/rest.js'],
  
  axios: {
    baseUrl: process.env.PRODUCTION ? 'https://certificate.rnft.fr' : 'http://localhost:3000'
  }, 

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'rNFT x iExec',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

   // Global CSS: https://go.nuxtjs.dev/config-css
   css: [
    '@/assets/scss/custom-bootstrap.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/persistedState.js', mode: 'client' },
    '~/plugins/fontAwesome.js',
    {src: '~plugins/web3modalVue', mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'web3modal-vue' 
    ],
  },

  bootstrapVue: {
    bootstrapCSS: false, 
    bootstrapVueCSS: false
  },

  rules: [
    {
       test: /\.s[ac]ss$/i,
       use: ['style-loader','css-loader','sass-loader',],
     },
  ],

  googleFonts: {
    families:{
      'Barlow': [100,200,300,400,500,600,700,800,900],
      'Montserrat': [100,200,300,400,500,600,700,800,900]
    } 
  },

  fontawesome: {
    icons: {
      solid: [ "faRightToBracket", "faWallet", "faRotate"],
      //brands: ['faLinkedinIn', 'faTwitter', 'faFacebookF'],
      //regular: ['faWallet'],
    }

  },
}
