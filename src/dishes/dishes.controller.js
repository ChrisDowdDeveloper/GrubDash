const path = require("path");
const { STATUS_CODES } = require("http")
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function hasData(propertyName) {
    return (req, res, next) => {
        const { data = {} } = req.body;
        const value = data[propertyName];
        if(value) {
            return next()
        }
        next({
            status: 400,
            message: `Dish must include a ${propertyName}`
        });
    };
};
const nameData = hasData("name");
const descriptionData = hasData("description");
const priceData = hasData("price");
const image_urlData = hasData("image_url");

function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if(foundDish) {
        res.locals.dishId = foundDish;
        next();
    }
    next({
        status: 404,
        message: `No matching dish found ${dishId}`
    });
};

function priceIsNumber(req, res, next) {
  const { data: { price } = {} } = req.body
  if( !Number.isInteger(price) ) {
    next({
      status: 400,
      message: `price is not a number`
    })
  }
  if(price <= 0) {
    next({
      status: 400,
      message: `price cannot be less than 0`
    })
  }
  next();
};


function list(req, res, next) {
    res.json({ data: dishes });
};

function read(req, res, next) {
    const { dishId } = res.locals;
    res.json({ data: dishId });
};

function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
};

function dataMatch(req, res, next) {
    const { dishId } = res.locals;
    const { data: { id } = {} } = req.body;
    if(id === dishId.id || id === null || !id) {
        next();
    } 
    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}.`
    });
};

function update(req, res, next) {
    let dish = res.locals.dishId;
    let originalName = dish.name;
    let originalDescription = dish.description;
    let originalPrice = dish.price;
    let originalImage = dish.image_url;
    let { data: { name, description, price, image_url } = {} } = req.body;
    if(originalName !== dish.name) {
        originalName = name;
    }
    if(originalDescription !== dish.description) {
        originalDescription = description;
    }
    if(originalPrice !== dish.price) {
        originalPrice = price;
    }
    if(originalImage !== dish.image_url) {
        originalImage = image_url;  
    }
    res.json({ data: { id: req.params.dishId, name, description, price, image_url } })
};

function destroy(req, res, next) {
    next({
      status: 405, 
      message: "dish cannot be deleted"
    })
};

module.exports = { 
    list,
    read: [dishExists, read],
    create: [
        nameData,
        descriptionData,
        priceData,
        image_urlData,
        priceIsNumber,
        create,
    ],
    update: [
        dishExists,
        nameData,
        descriptionData,
        priceData,
        image_urlData,
        priceIsNumber,
        dataMatch,
        update,
    ],
    delete: destroy,
};
