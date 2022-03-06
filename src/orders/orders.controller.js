const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function reqOrderHasData(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if(dishes) {
        next();
    } else {
        next({
            status: 400,
            message: "An order has not been placed"
        });
    };
};

function isValidOrder(req, res, next) {
    const { orderId } = req.params;
    const findOrder = orders.find(order => order.id === Number(orderId));
    if(foundOrder) {
        res.locals.order = foundOrder;
        next();
    } else {
        next({
            status: 400,
            message: `an order with the id of ${orderId} is not found`
        });
    };
};

//create
function create(req, res, next) {
    const { data: { dishes } = {} } = req.params;
    const newOrder = {
        id: nextId,
        deliverTo,
        mobileNumber,
        status,
        dishes: [{ id: nextId, name, description, image_url, price, quantity }]
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

//list
function list(req, res, next) {
    res.json({ data: orders });
}

//read
function read(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find(order => order.id === Number(orderId)); 
    res.json({ data: foundOrder });
}

//delete
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex(order => order.id === Number(orderId));
    if(index > -1) {
        orders.splice(index, 1);
    }
    res.sendStatus(204);
}

//update
function update(req, res) {
    const { orderId } = req.params;
    const foundOrder = orders.find(order => order.id === Number(orderId));
    const { data: { dishes } = {} } = req.body;
    foundOrder.dishes = dishes;
    res.json({ data: foundOrder });
}

module.exports = {
    create: [reqOrderHasData, create],
    list,
    read: [isValidOrder, read],
    update: [isValidOrder, reqOrderHasData, update],
    delete: destroy,
    isValidOrder,
};