import {getCurrentInstance} from "vue";

/**
 * @param app {{directive,mixin}} Vue实例
 */
export function vueBindSSRPlugin(app) {
    app.directive('v-ssr', {});
    app.mixin({
        props: {
            "dataSsrId": {
                type: String,
                default: ''
            }
        },
    })
}

import {crc32} from "hash-wasm";
export const viteBindSSRPlugin = {
    name: 'bind-ssr-id',
    transform(src, id) {
        if (!/\.(vue)$/.test(id)) {
            return null;
        }
        
        //首先查找v-ssr所有的位置
        let ssrIndex = [];
        let index = src.indexOf('v-ssr');
        while (index !== -1) {
            ssrIndex.push(index);
            index = src.indexOf('v-ssr', index + 1);
        }
        
        //替换v-ssr为data-ssr-id=${hash(file+line+column)}
        let result = src;
        let task = Promise.resolve();
        for (let index of ssrIndex) {
            let line = 1;
            let column = 0;
            for (let i = 0; i < index; i++) {
                if (src[i] === '\n') {
                    line++;
                    column = 0;
                } else {
                    column++;
                }
            }
            task = task.then(() => {
                return crc32(`${id}${line}${column}`).then((hash) => {
                    result = result.replace('v-ssr', `data-ssr-id="${hash}"`);
                });
            });
        }
        return {
            code: result,
            map: null,
        };
    },
};


export function useId(){
    const instance = getCurrentInstance();
    return instance.props.dataSsrId;
}
