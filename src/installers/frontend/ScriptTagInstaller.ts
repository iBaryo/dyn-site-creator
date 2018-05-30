import {DomInstaller} from "./DomInstaller";
import {CodeNode} from "../../ConfigurationTypes";

export interface IScript {
    code?: string;
    attributes?: { [name: string]: string };
}

export type ScriptGeneratorFn = (req, config) => Promise<IScript | string>

export class ScriptTagInstaller extends DomInstaller {
    protected run(fn: ScriptGeneratorFn, options, req) {
        return super.run(async (req, config) => {
            const scriptData = await fn(req, config);
            const {code, attributes} = this.getScript(scriptData, options);

            return `
<script ${Object.keys(attributes).map(key => `${key}="${attributes[key]}"`).join(' ')}>
${code}
</script>
            `;
        }, options, req);
    }

    private getScript(scriptData: IScript | string, options: CodeNode) {
        let script: IScript;
        if (typeof scriptData == 'object') {
            script = scriptData;
        } else {
            script = {code: scriptData.toString()};
        }

        const nodeScriptAttrs = Object.keys(options)
            .filter(opt => opt.startsWith('attr-'))
            .reduce((res, attr) => {
                res[attr.replace('attr-', '')] = options[attr];
                return res;
            }, {});

        script.attributes = Object.assign(script.attributes || {}, nodeScriptAttrs);
        script.code = script.code || '';

        return script;
    }
}