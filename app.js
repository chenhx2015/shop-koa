const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

// const sqlConnection = require('./db');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'shop'
});

connection.connect();

const Router = require('koa-router');
const router = new Router();
const mount = require('./api');
mount(router, connection);

app.use(cors());
app.use(bodyParser());
app.use(router.routes());

app.on('error', err => {
    console.log('server error', err);
});

const server = app.listen(3000);

function handle(signal) {
    connection.end();
    server.close()
}

process.on('SIGINT', handle);