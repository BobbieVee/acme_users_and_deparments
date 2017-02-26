const express = require('express');
const app = express();
const db = require('./db');
const nunjucks = require('nunjucks');

const noCache = process.env.NOCACHE || false;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: noCache});


app.use('/', (req, res, next)=> {
	res.render('index');
});
const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Listening on port ${port}`))

db.seed();