import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
// access to express router, creating different routes
const router = express.Router()

// the created routes
router.route("/").get((req, res) => res.send("hello world"))

export default router