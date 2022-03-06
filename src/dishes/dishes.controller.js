const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === Number(dishId));
    if(dishId) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `A dish with the id of ${dishId} could not be found`
    });
};

//create
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId,
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function hasInfo(req, res, next) {
    const { data: { description } = {} } = req.body;
    if(description) {
        return next();
    }
    next({
        status: 400,
        message: `The item needs to be filled out.`
    });
}

//list
function list(req, res) {
    res.json({ data: dishes });
}

//update
function update(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === Number(dishId));
    const { data: { description } = {} } = req.body;
    foundDish.description = description;
    res.json({ data: foundDish });
}

//read
function read(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId);
    res.json({ data: foundDish });
}

module.exports = {
    create: [hasInfo, create],
    list,
    read: [dishExists, read],
    update: [dishExists, hasInfo, update],
    dishExists,
};