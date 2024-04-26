import { defineNuxtModule, createResolver, addPlugin, addComponent, addServerImports } from 'nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: 'hyperbeam-nuxt',
        configKey: 'hyperbeam',
    },
    defaults: {
        token: '',
        apiBase: '/api/hyperbeam',
    },
    setup(options, nuxt) {
        nuxt.options.runtimeConfig.public.hyperbeam = {
            apiBase: options.apiBase,
        }
        nuxt.options.runtimeConfig.hyperbeam = {
            token: options.token,
        }

        const { resolve } = createResolver(import.meta.url)
        addComponent({
            filePath: resolve('./runtime/components/Hyperbeam.vue'),
            name: 'Hyperbeam',
        })
        addServerImports([{
            from: resolve('./runtime/server/handler'),
            name: 'defineHyperbeamHandler',
        }])
    },
})
