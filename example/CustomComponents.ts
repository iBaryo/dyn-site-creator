import {FeatureComponent} from "../src/code-components/FeatureComponent";
import {backendFactory, frontendFactory} from "../src/factories";
import {CustomScriptComponent} from "../src/code-components/frontend/CustomScriptComponent";
import {JsonEndpointComponent, JsonEndpointNode} from "../src/code-components/backend/JsonEndpointComponent";
import {ScriptTagComponent} from "../src/code-components/frontend/ScriptTagComponent";

export function addCustomComponents() {
    frontendFactory.addType(class MyScript extends CustomScriptComponent {
        public static get typeName() { return 'my-script'; }
        protected getScopeArgs() {
            return [
                'window[config.apiName]'
            ];
        }
    });

    backendFactory.addType(class MyFeature extends FeatureComponent {
        public static get typeName() { return 'my-feature'; }
        private _endpointName = 'myFeatureEndpoint';

        public get backend() {
            return [
                {
                    type: JsonEndpointComponent.typeName,
                    desc: 'my-feature endpoint',
                    name: this._endpointName,
                    code: async (req, config) => ({myFeature: true, query: req.query})
                } as JsonEndpointNode
            ];
        }

        public get frontend() {
            return {
                defaultPage: {
                    head: [],
                    body: [
                        {
                            type: ScriptTagComponent.typeName,
                            desc: 'my-feature script',
                            code: `fetch('${this._endpointName}'+location.search).then(r => r.json()).then(console.log)`
                        }
                    ]
                }
            }
        }
    });
}