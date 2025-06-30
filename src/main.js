import App from '@/App.vue';
import en from '@/lib/vue-finder/locales/en.js';
import ru from '@/lib/vue-finder/locales/ru.js';
import tr from '@/lib/vue-finder/locales/tr.js';
import '@/lib/vue-finder/style.css';
import VueFinder from '@/lib/vue-finder/vuefinder';
import { registerPlugins } from '@core/utils/plugins';
// import { gulp as i18nextParser } from 'i18next-parser';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import Vue3Signature from "vue3-signature";
// import globalFunctions from './plugins/globalFunctions';

// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import VDatePicker from 'v-calendar';
import 'v-calendar/style.css';
import VueKonva from 'vue-konva';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import store from './store';



// Create vue app
const app = createApp(App)
const i18n = createI18n({
    legacy: false
    // something vue-i18n options here ...
})
app.provide('test123', 'test123')
app.provide('teleportPortal', ref({ portals: {}, removeCallbacks: {}, addCallbacks: {} }))
app.use(VDatePicker, {})
app.use(store)
app.use(Vue3Signature)
app.use(VueKonva);
app.use(Toast, {
    // Optional options here
    maxToasts: 10,
    newestOnTop: true
})
app.use(VueFinder, {
    i18n: { en, tr, ru }
});
// gulp.task('i18next', function () {
//     gulp
//         .src('src/**/*')
//         .pipe(
//             new i18nextParser({
//                 locales: ['en', 'fr'],
//                 output: 'locales/$LOCALE/$NAMESPACE.json',
//             })
//         )
//         .pipe(gulp.dest('./'))
// })
app.use(i18n)
// app.use(globalFunctions);
// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')




