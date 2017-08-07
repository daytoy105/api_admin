var app = require('koa')();
var path = require('path')

app.use(require('koa-static')(__dirname, {
        maxAge: 1000 * 60 * 60 * 24,
        gzip: true,
    }
));
app.listen(1234, '127.0.0.1');
console.log('Server is @1234');