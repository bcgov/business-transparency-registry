import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/*.{html,ts,js,vue}',
    './components/*.{html,ts,js,vue}',
    './enums/*.{html,ts,js,vue}',
    './interfaces/*.{html,ts,js,vue}',
    './middleware/*.{html,ts,js,vue}',
    './pages/*.{html,ts,js,vue}',
    './stores/*.{html,ts,js,vue}',
    './utils/*.{html,ts,js,vue}',
    './app.vue'
  ]
}
