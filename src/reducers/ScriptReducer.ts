import {DefaultFrontendReducer} from "./DefaultFrontendReducer";

export class ScriptReducer extends DefaultFrontendReducer {
    protected async reduceFn(res: string, cur: string) {
        // todo: remove script tags only from the begining and the end
        cur = cur.replace(/<\/?script[^>]*>/gi, '')
            .replace(/<\!?--(.*)--[^>]*>/gi, '/*$1*/');
        return super.reduceFn(res, cur);
    }

    protected async postProcess(res: string) {
        return `<script class="reduced">
    ${res}
</script>`;
    }
}