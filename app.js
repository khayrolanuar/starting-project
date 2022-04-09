
// create server
const fs = require('fs');
const path = require ('path');
const express = require('express');
const uuid = require('uuid');

const app =  express();

app.set('views', path.join(__dirname,'views')) //views in parameter is folder name
app.set('view engine', 'ejs'); //for ejs template engine

app.use(express.static('public')); //for executed css file and js file in the public folder
app.use(express.urlencoded({ extended: false}));
// create path route for index.html in server side code
app.get('/', function(req, res) {
    res.render('index'); //for ejs template engine

    // const htmlFilePath = path.join(__dirname, 'views', 'index.html');
    // res.sendFile(htmlFilePath);
});
// create path route for restaurant.html in server side code
app.get('/restaurants', function(req, res){
    const filePath = path.join(__dirname, 'data','restaurants.json');

    const fileData =  fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    res.render('restaurants', { numberOfRestaurants: storedRestaurants.length, restaurants: storedRestaurants,
     }); //for ejs template engine

    // const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');
    // res.sendFile(htmlFilePath);
});

app.get('/restaurants/:id', function (req, res){ // /restaurants/r1
     const restaurantId = req.params.id;
     const filePath = path.join(__dirname, 'data','restaurants.json');

    const fileData =  fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId){
            return res.render('restaurant-detail', { restaurant: restaurant });
        }
    }

   res.status(404).render('404');
});


// create path route for about.html in server side code
app.get('/about', function(req, res){
    res.render('about'); //for ejs template engine
    // const htmlFilePath = path.join(__dirname, 'views', 'about.html');
    // res.sendFile(htmlFilePath);
});

// create path route for confirm.html in server side code
app.get('/confirm', function(req, res){
    res.render('confirm'); //for ejs template engine
    // const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    // res.sendFile(htmlFilePath);
});

// create path route for recommend.html in server side code
app.get('/recommend', function(req, res){
    res.render('recommend'); //for ejs template engine
    // const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    // res.sendFile(htmlFilePath);
});

app.post('/recommend', function(req, res){
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const restaurants = getStoreRestaurants ();

    restaurants.push(restaurant);

    storeRestaurants(restaurants);

    res.redirect('/confirm');
});


app.use(function (req, res) {
    res.status(404).render('404'); // handle Non-Existing route. it will show error page
});

app.use(function(error, req, res, next) { //handling server-side errors 500 status code
    res.status(500).render('500');
}) 

app.listen(3000);