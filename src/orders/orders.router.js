const router = require("express").Router();
const controller = require("./orders.controller");
const dishesRouter = require("../dishes/dishes.router");
const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /orders routes needed to make the tests pass
router.use("/:orderId")
    .get(controller.read)
    .post(controller.create)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);
router.use("/")
    .get(controller.list)
    .all(methodNotAllowed);
module.exports = router;
