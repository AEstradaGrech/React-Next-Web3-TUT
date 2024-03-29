const { createServer } = require('http');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes.js');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (error) => {
        if(error) throw error;
        console.log('Listening on port 3000...');
    })
})