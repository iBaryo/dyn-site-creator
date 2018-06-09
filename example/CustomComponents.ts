import {FeatureComponent} from "../src/code-components/FeatureComponent";
import {backendFactory, frontendFactory} from "../src/factories";
import {ScopedScriptComponent} from "../src/code-components/frontend/CustomScriptComponent";
import {JsonEndpointComponent, JsonEndpointNode} from "../src/code-components/backend/JsonEndpointComponent";
import {ScriptTagComponent} from "../src/code-components/frontend/ScriptTagComponent";
import {DomComponent} from "../src/code-components/frontend/DomComponent";
import {IAppConfig} from "../src/AppConfigure";
import {CodeNode} from "../src/ConfigurationTypes";
import {HtmlPageComponent} from "../src/code-components/backend/HtmlPage/HtmlPageComponent";
import {HtmlNode} from "../src/code-components/backend/HtmlPage/interfaces";

export function addCustomComponents() {
    frontendFactory.addType(class FrontendTestSection extends DomComponent {
        public static get typeName() {
            return 'test-section';
        }

        private getAllCodeNodes(root: CodeNode[]) {
            const isNodeAssertable = node => node['ext-assert'];
            const firstLevel = root.filter(isNodeAssertable);

            const htmlInnerComponents =
                root.filter(node => node.type == HtmlPageComponent.typeName)
                    .reduce((res, cur: HtmlNode) =>
                            res.concat(cur.head.filter(isNodeAssertable))
                                .concat(cur.body.filter(isNodeAssertable)),
                        []);

            return htmlInnerComponents
                .concat(firstLevel)
                .map(node => ({
                    desc: node.desc,
                    assert: node['ext-assert']
                }));
        }

        protected run(options, fn) {
            return super.run(options, () => {
                const specs = this.getAllCodeNodes(
                    (require('./dyn-components.json') as IAppConfig).code
                );

                return `
<section id="tests" style="margin-bottom: 30px">
    <h3>Tests results</h3>
    <div id="loading">loading results...</div>
    <table id="results" style="display: none;">
    </table>
    <script>
    const specs = ${JSON.stringify(specs, undefined, 4)};
    setTimeout(() => {
        document.querySelector('#loading').style.display = 'none';
        const resContainer = document.querySelector('#results');
        
        const resStrings = specs.map(spec => ({desc: spec.desc, res: eval(spec.assert)}))
        .map(specRes => '<tr><td>' + specRes.desc + '</td><td class="' + specRes.res.toString() + '">' + specRes.res.toString() + '</td></tr>');
        resContainer.innerHTML = resStrings.join('\\n');
        resContainer.style.display = 'block';
    }, 500);
</script>         
</section>
                `;
            }, null);
        }

    });

    frontendFactory.addType(class MyScript extends ScopedScriptComponent {
        public static get typeName() {
            return 'my-script';
        }

        protected getScopeArgs() {
            return [
                'window[config.apiName]'
            ];
        }
    });

    backendFactory.addType(class MyFeature extends FeatureComponent {
        public static get typeName() {
            return 'my-feature';
        }

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
                            code: `
fetch('${this._endpointName}'+location.search)
.then(r => r.json())
.then(r => window.testResults.featureEndpointResult = r);`
                        }
                    ]
                }
            }
        }
    });
}