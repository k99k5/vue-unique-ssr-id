A Vue 3 plugin to generate unique SSR id for each component
---
Installation
---
**vite.config.js**

* Add the following code to the vite.config.js file:

```javascript
import {viteBindSSRPlugin} from "vue-unique-ssr-id";
import vuePlugin from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        viteBindSSRPlugin(),
        vuePlugin(),
    ],
});
```

* Add the following code to the main.js file:

```javascript
import {vueBindSSRPlugin, vueSSRMarker} from "vue-unique-ssr-id";

app.use(vueBindSSRPlugin);

app.directive('ssr', vueSSRMarker);
```
