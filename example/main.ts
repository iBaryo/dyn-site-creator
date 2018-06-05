import {AppConfigure, frontendFactory, CustomScriptComponent} from '../index';
const app = require('express')();

frontendFactory.addType('my-script', class MyScript extends CustomScriptComponent {
    protected getScopeArgs() {
        return [
            'window[config.apiName]'
        ];
    }
});

(async () => {
    app.get('/test', (req, res) => {
        res.send('hello bitches');
    });

    console.log('installing...');
    try {
        await new AppConfigure(app, require('./dyn-components.json')).install();
        console.log('listening...');
        app.listen(8080);
    }
    catch (e) {
        console.log(e);
    }
})();
