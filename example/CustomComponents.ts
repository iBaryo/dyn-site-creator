import {
    FeatureComponent, backendFactory, frontendFactory, ScopedScriptComponent,
    JsonEndpointComponent, JsonEndpointNode, ScriptTagComponent, DomComponent, IAppComponentsConfig, CodeNode,
    HtmlPageComponent, HtmlNode
} from "../index";

export function addCustomComponents() {
    backendFactory.addType(class MyFeature extends FeatureComponent {
        public static get typeName() {
            return 'my-feature';
        }

        private readonly _endpointName = 'myFeatureEndpoint';

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

    frontendFactory.addType(class MyScript extends ScopedScriptComponent {
        public static get typeName() {
            return 'my-script';
        }

        protected getScopeArgs() {
            return [
                'window.config',
                'window[config.apiName]'
            ];
        }
    });

    frontendFactory.addType(class FrontendTestSection extends DomComponent {
        public static get typeName() {
            return 'test-section';
        }

        public run(options, fn) {
            return super.run(options, () => {
                const specs = this.getAssertableNodes(
                    (require('./dyn-components.json') as IAppComponentsConfig).code
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
        
        const resStrings = specs.map(spec => ({desc: spec.desc, res: eval(spec.assert) || false}))
        .map(specRes => '<tr><td>' + specRes.desc + '</td><td class="' + specRes.res.toString() + '">' + specRes.res.toString() + '</td></tr>');
        resContainer.innerHTML = resStrings.join('\\n');
        resContainer.style.display = 'block';
    }, 500);
</script>         
</section>
                `;
            }, null);
        }

        private getAssertableNodes(root: CodeNode[]) {
            const getNodeAssertion = node => node['ext-assert'];
            const firstLevel = root.filter(getNodeAssertion);

            const htmlInnerComponents =
                root.filter(node => node.type == HtmlPageComponent.typeName)
                    .reduce((res, cur: HtmlNode) =>
                            res.concat(cur.head.filter(getNodeAssertion))
                                .concat(cur.body.filter(getNodeAssertion)),
                        []);

            return htmlInnerComponents
                .concat(firstLevel)
                .map(node => ({
                    desc: node.desc,
                    assert: getNodeAssertion(node)
                }));
        }

    });
}