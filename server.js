/* eslint no-console: 0 */
const express = require('express');
const next = require('next');
const {createProxyMiddleware} = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

const proxyConfig = {
    target: 'https://freegeoip.app',
    changeOrigin: true,
    followRedirects: true,
    pathRewrite: {
        '^.*': '/json/'
    },
    headers: {
        'X-KEY': 'helloworld'
    }
};

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const server = express();
const app = next({dev});
const handle = app.getRequestHandler();

(async () => {
    try {
        await app.prepare();
        server.use(createProxyMiddleware('/geo', proxyConfig));
        server.all('*', (req, res) => handle(req, res));
        server.listen(port, (err) => {
            if (err) {
                throw err;
            }
            console.log(`> Ready on http://localhost:${port}`);
        });
    } catch (err) {
        console.log('An error occurred, unable to start the server');
        console.log(err);
    }
})();
