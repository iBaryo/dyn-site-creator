import {DomComponent} from "./DomComponent";
import {CodeNode} from "../../ConfigurationTypes";

export interface IScript {
    code?: string;
    attributes?: { [name: string]: string };
}

export type ScriptGeneratorFn = (req, config) => Promise<IScript | string>;

export interface ScriptNode extends CodeNode {
    src?: string;
}

export const attributePrefix = 'attr-';

export class ScriptTagComponent extends DomComponent {
    protected run(options: ScriptNode, fn: ScriptGeneratorFn, req) {
        return super.run(options, async (req, config) => {
            const runtimeOptions: ScriptNode = Object.assign({}, options);
            if (options.src) {
                // `options.src` can evaluated - and `req` & `config` should be available to use from scope.
                const scriptSrc = options.src.startsWith('`') ? eval(options.src) : options.src;
                runtimeOptions[`${attributePrefix}src`] = scriptSrc;
            }

            const scriptData = await fn(req, config);
            const {code, attributes} = this.getScript(scriptData, runtimeOptions);

            return `
<script ${Object.keys(attributes).map(key => `${key}="${attributes[key]}"`).join(' ')}>
${code}
</script>
            `;
        }, req);
    }

    private getScript(scriptData: IScript | string, options: ScriptNode) {
        let script: IScript;
        if (typeof scriptData == 'object') {
            script = scriptData;
        } else {
            script = {code: scriptData.toString()};
        }

        const nodeScriptAttrs = Object.keys(options)
            .filter(opt => opt.startsWith(attributePrefix))
            .reduce((res, attr) => {
                res[attr.replace(attributePrefix, '')] = options[attr];
                return res;
            }, {});

        // overriding the attributes from the scriptData with ones from options
        script.attributes = Object.assign(script.attributes || {}, nodeScriptAttrs);
        script.code = script.code || '';

        return script;
    }
}