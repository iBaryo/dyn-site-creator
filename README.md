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
###Backend Components
* default type: `'server'`

####ServerCodeComponent
* type: `'server'`
* description: code executed when the server is created. 
* code signature: `(app: Express.Application, config: ConfigNode) => Promise<any>`

####JsonEndpointComponent
* type: `'endpoint'`
* description: a server endpoint that returns a JSON object per request.
* code signature: `(req: Express.Request, config: ConfigNode) => Promise<any>|any`
* additional fields:
    * `name: string`: endpoint's name, for example: `'my-path/endpoint'`

####HtmlPageComponent
* type: `'html'`
* description: 
* code signature: not needed - default HTML structure (with `head` and `body`).
* additional fields:
    * `name: string` - page's name, for example: `'my-path/myPage.html'`
    * `head?: CodeNode[]` - an array of Frontend code-nodes
    * `body?: CodeNode[]` - an array of Frontend code-nodes
    * `disableConfigInjection?: boolean` (default: `false`) If `true`, prevents serialization of the `config` object into the page's `window.config`.

###Frontend Components
* default type: `'dom'`
* Frontend components are rendered inside their host HTML page according to its HTTP request.

####DOM Component
* type: `'dom'`
* description: 
* code signature: `string | (req: Express.Request, config: ConfigNode) => Promise<string>`
    * the resolved `string` will be placed in the hosting page
    
####Script Tag Component
* type: `'script'`
* description: an HTML script tag
* code signature: `string | (req: Express.Request, config: ConfigNode) => Promise<string>`
    * the resolved `string` will be the content of the `<script>` tag rendered in the page

####Scoped Script Tag Component
* type: `'scoped-script'`
* description: a function that will be invoked in the HTML page (as an IIFE).
* code signature: `(config: ConfigNode) => void`
* Notice that this is useful especially for extending to Scoped Custom Scripts (see below).

##Extending a Component
TODO

##Scoped Custom Script
TODO

##Creating a Feature Component
A Feature component brings e2e abilities - backend and frontend.

```typescript
export abstract class FeatureComponent {
    public abstract get backend(): CodeNode[];
    public abstract get frontend(): PageNodesDictionary;
}
```
TODO

##Running the example locally
* clone the repo
* `npm i`
* `npm run example`
* navigate to `http://localhost:8080/myPage.html
`
##Internal
###next steps:
* creator ui [angular?]
    * dependant on this package
    * packaged - as a module at npm
    * functionality - import/export of/to relevant json file
    * extensible - can add new components easily

* desktop app [electron?]
    * dependant on creator ui package
    * published - as an exe file
    * functionality - import/export as the above with FS + creating an express server instance with the loaded json
    * extensible - by forking the repo

* organizational implementation [gigya]
    * spec relevant components and features
    * develop together with cs
    
####Missing unit-tests for:
* HtmlPageComponent
* FeatureComponent
* 
