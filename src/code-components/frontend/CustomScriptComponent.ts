import {ScriptTagComponent} from "./ScriptTagComponent";

export class ScopedScriptComponent extends ScriptTagComponent {
    public static get typeName() { return 'scoped-script'; }

    protected getFn(code: string) {
        return super.getFn(code, false);
    }

    protected run(options, fn: { toString: () => string }) {
        return super.run(options, async () => {
            const args = ['window.config'].concat(this.getScopeArgs());
            return `(${fn.toString()})(${args.join(',')});`; // IIFE pattern
        }, null);
    }

    protected getScopeArgs() {
        return [] as string[];
    }
}