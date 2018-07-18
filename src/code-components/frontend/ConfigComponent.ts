import {ScriptGeneratorFn, ScriptNode, ScriptTagComponent} from "./ScriptTagComponent";

export class ConfigComponent extends ScriptTagComponent {
    public static get typeName() {
        return 'config-script';
    }

    public run(options: ScriptNode, fn = null, req) {
        return super.run(
            options,
            async (req, config) => `window.config = ${JSON.stringify(config)};`,
            req
        );
    }
}