class SiteController {
    //[GET] /
    index(req, res) {
        res.render('home'); // Render trang 'home.handlebars'
    }

    //[GET / search]
    search(req, res) {
        res.render('search'); // Render trang 'search.handlebars'
    }
}

module.exports = new SiteController();
