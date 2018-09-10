#Dynamic Site Creator
Create a complete website from a `json` file based of configurable and extensible components!

The real power of this platform is to extend the existing components and create custom e2e features.

##Example
Create an Express server and install the configured components:
```typescript
import {AppComponents} from 'dyn-site';

const app = require('express')();

(async () => {
    console.log('installing...');
    try {
        const components = new AppComponents(app, require('./components.json'));
        await components.install();
        
        console.log('listening...');
        app.listen(8080);
    }
    catch (e) {
        console.log(e);
    }
})();
```

`components.json` file: 
```json
{
  "config": [
    {
      "key": "value"
    }
  ],
  "code": [
    {
      "type": "server",
      "desc": "async initializing app",
      "code": "(app) => new Promise(r => setTimeout(() => {app.tools = {isOk: true}; r();}, 0))"
    },
    {
      "type": "endpoint",
      "name": "myEndpoint",
      "desc": "test endpoint",
      "code": "(req) => ({ isOk: this.context.app.tools.isOk, query: req.query })"
    },
    {
      "type": "html",
      "name": "myPage.html",
      "desc": "test html page",
      "head": [
        {
          "type": "dom",
          "desc": "test dom element",
          "code": "<title id=\"my-title\">test page</title>"
        },
        {
          "type": "script",
          "desc": "test script element",
          "code": "(req, config) => `alert('${config.key}');`"
        }
      ],
      "body": [
        {
          "type": "script",
          "desc": "test script that calls test endpoint",
          "code": "fetch(`myEndpoint${location.search}`).then(r => alert(r.json()));"
        },
        {
          "type": "scoped-script",
          "desc": "test scoped client script",
          "code": "(config) => alert(config.key)"
        }
      ]
    }
  ]
}
```

##JSON configuration structure
Other than the `Express.Application` object use to create the server, the second parameter required to the `AppComponents` constructor must follow the following interface (`components.json` from the above example):
```typescript
interface IAppComponentsConfig {
    config?: ConfigNode[];
    code: CodeNode[];
}

export type ConfigNode = { 
    [key: string]: string; 
};
export type CodeNode = {
    type?: string; // detailed below
    desc: string;
    code?: string|Function;
};
```
##Component Types
A component contains a piece of code that will be executed in a context according to its type. 

###Backend Components
* Default type: `'server'`

####ServerCodeComponent
* Type: `'server'`
* Description: code executed when the server is created. 
* Code signature: `(app: Express.Application, config: ConfigNode) => Promise<any>`

####JsonEndpointComponent
* Type: `'endpoint'`
* Description: a server endpoint that returns a JSON object per request.
* Code signature: `(req: Express.Request, config: ConfigNode) => Promise<any>|any`
* Additional fields:
    * `name: string`: endpoint's name, for example: `'my-path/endpoint'`

####HtmlPageComponent
* Type: `'html'`
* Description: 
* Code signature: not needed - default HTML structure (with `head` and `body`).
* Additional fields:
    * `name: string` - page's name, for example: `'my-path/myPage.html'`
    * `head?: CodeNode[]` - an array of Frontend code-nodes
    * `body?: CodeNode[]` - an array of Frontend code-nodes
    * `disableConfigInjection?: boolean` (default: `false`) If `true`, prevents serialization of the `config` object into the page's `window.config`.

###Frontend Components
* Default type: `'dom'`
* Frontend components are rendered inside their host HTML page according to its HTTP request.

####DOM Component
* Type: `'dom'`
* Description: 
* Code signature: `string | (req: Express.Request, config: ConfigNode) => Promise<string>`
    * the resolved `string` will be placed in the hosting page
    
####Script Tag Component
* Type: `'script'`
* Description: an HTML script tag
* Code signature: `string | (req: Express.Request, config: ConfigNode) => Promise<string>`
    * the resolved `string` will be the content of the `<script>` tag rendered in the page

####Scoped Script Tag Component
* Type: `'scoped-script'`
* Description: a function that will be invoked in the HTML page (as an IIFE).
* Code signature: `(config: ConfigNode) => void`
* Notice that this is useful especially for extending to Scoped Custom Scripts (see below).

##Extending a Component
Extending an existing component usually consists of 4 simple steps:
* Create a class that extends the wanted component
* Set the component's type name
    * By overriding the static `typeName` getter: `public static get typeName()`
* Set the component's logic
    * By overriding the `run` method:
        * for backend components:   `public run(options: CodeNode, fn: Function): Promise<any>`
        * for frontend components:  `public run(options: CodeNode, fn: Function, req: Express.Request): Promise<string>`
    * Important(!): always call and return the `super.run`'s return value - see example.
* Add it to the relevant factory: `frontendFactory` or `backendFactory`.
    
Example:
```typescript
import {frontendFactory, DomComponent} from 'dyn-site';

class MyDomComponent extends DomComponent {
    public static get typeName() {
        return 'my-dom';
    }

    public run(options, fn, req) {
        return super.run(options, (req, config) => {
            return `<my-dom></my-dom>`;
        }, req);
    }
}

frontendFactory.addType(MyDomComponent);
```

##Scoped Custom Script
When we want to allow our implementing users to easily use custom injected objects.

Usage example:
```json
{
  "type": "my-script",
  "desc": "my scoped custom script",
  "code": "async (config, myApi) => await myApi.doAction()"
}
```
This component will usually be hosted inside an html page component - and its script will be invoked immediately, supplying `myApi` object to the implementation use. 

Implementing this requirement:
```typescript
import {frontendFactory, ScopedScriptComponent} from 'dyn-site';

frontendFactory.addType(class MyScript extends ScopedScriptComponent {
        public static get typeName() {
            return 'my-script';
        }

        protected getScopeArgs() {
            return [
                'window.config',
                'window.myCompany.getApiObject()'
            ];
        }
});
```
Notice that `getScopeArgs` method returns an array of strings that indicate from where to inject the the arguments.


##Creating a Feature Component
A Feature component brings e2e abilities - backend and frontend components.

Usage example:
```json
{
  "type": "my-feature",
  "desc": "a custom feature"
}
```

A new feature component must extend from the following abstract class:
```typescript
export abstract class FeatureComponent {
    public abstract get backend(): CodeNode[];
    public abstract get frontend(): PageNodesDictionary;
}
```

Implmentation example:
```typescript
import {backendFactory, FeatureComponent, JsonEndpointComponent, JsonEndpointNode, ScriptTagComponent} from 'dyn-site';

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
fetch('${this._endpointName}' + location.search)
.then(r => JSON.stringify(r.json())).then(console.log);`
                        }
                    ]
                }
            }
        }
    });
```

* The `backend` getter returns an array of `CodeNode`s that describe backend components as the example above.
    * In this example, we're simply creating a new endpoint that returns an object.
* The `frontend` getter returns a dictionary of page type's `string` to `HTMLPageComponent`.
    * page type:
        * `defaultPage` - will be the first `HTMLPageComponent` found.
        * Other page types can be set freely and mapped to an actual `HTMLPageComponent` in the feature's code node:
        ```json
        {
          "type": "my-feature",
          "desc": "a custom feature",
          "frontend": {
            "defaultPage": "index.html",
            "loginPage": "login.html",
            "accountPage": "account.html"
          }
        }
        ```  
    * `HTMLPageComponent`: The frontend components of it will be added to the relevant page. 

##Advanced Extensions of Components
When extending a component, you can re-implemented the following interfaces to override functionality in the component's life cycle:

```typescript
export interface IValidate {
    validate(node: CodeNode): void;
}
export interface IGetFn {
    getFn(code: string|Function): Function;
}
export interface IGetActivator<T> {
    getActivator(fn : Function, options: CodeNode): ICodeActivator<T>
}
```

##Running the example locally
* clone the repo
* `npm i`
* `npm run example`
* navigate to `http://localhost:8080/myPage.html`
