const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars'); // Import handlebars
const path = require('path'); // Import path
const app = express();
const port = 3000;

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

// Template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
})); // Sử dụng .engine() thay vì gọi trực tiếp

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);
// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
