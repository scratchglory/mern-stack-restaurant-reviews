import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000 // if can't be access make it 8000

// starting the server
MongoClient.connect(
  // passing database to online
    process.env.RESTREVIEWS_DB_URI,
    {
      poolSize: 50,
      wtimeout: 2500,
      useNewUrlParse: true }
    )
    // check database for errors
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
    // start web server
    .then(async client=> {
      //before we start the server, get initial ref to restaurant db
      await RestaurantsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })

    // must be nodemon server (not server.js)