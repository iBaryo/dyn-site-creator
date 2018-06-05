import {AppConfigure} from '../index';

const app = require('express')();
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