import {ScriptTagComponent} from "./ScriptTagComponent";

export class ScopedScriptComponent extends ScriptTagComponent {
    public static get typeName() { return 'scoped-script'; }

    public getFn(code: string) {
        return super.getFn(code, false);
    }

    public run(options, fn: { toString: () => string }) {
        return super.run(options, async () => {
            return `(${fn.toString()})(${this.getScopeArgs().join(',')});`; // IIFE pattern
        }, null);
    }

    protected getScopeArgs(): string[] {
        return ['window.config'];
    }
}