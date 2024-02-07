import {getCurrentInstance} from "vue";
import {createCRC32} from "hash-wasm";

/**
 * @param app {{directive,mixin}} Vue实例
 */
export function vueBindSSRPlugin(app) {
    app.mixin({
        props: {
            "dataSsrId": {
                type: String,
                default: ''
            }
        },
    })
}

export function vueSSRMarker() {

}

export async function viteBindSSRPlugin() {
    const crc32Instance = (await createCRC32());
    return {
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
                const hash = crc32Instance.init().update(`${id}${line}${column}`).digest('hex');
                result = result.replace('v-ssr', `data-ssr-id="${hash}"`);
            }
            return result;
        },
    }
}


export function useId() {
    const instance = getCurrentInstance();
    return instance.props.dataSsrId;
}
