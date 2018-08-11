import {AppComponents} from '../index';
import {addCustomComponents} from "./CustomComponents";

const app = require('express')();

(async () => {
    app.get('/test', (req, res) => {
        res.send('hello beautiful people');
    });

    addCustomComponents();

    console.log('installing...');
    try {
        await new AppComponents(app, require('./dyn-components.json')).install();
        console.log('listening...');
        app.listen(8080);
    }
    catch (e) {
        console.log(e);
    }
})();
