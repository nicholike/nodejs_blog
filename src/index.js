const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars'); // Import handlebars
const path = require('path'); // Import path
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));


// Template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
})); // Sử dụng .engine() thay vì gọi trực tiếp
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views')); // Sửa 'view' thành 'views'

// Routes
app.get('/', (req, res) => {
  res.render('home'); // Render trang 'home.handlebars'
});

app.get('/news', (req, res) => {
  res.render('news'); // Render trang 'home.handlebars'
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
