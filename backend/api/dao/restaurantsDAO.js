let restaurants // use to store a reference to the database

export default class RestaurantsDAO {
    // once the server starts, we get a reference to the restaurant database
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        // if variable not filled, fill it
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")

        }
    }

    // function: this is will call to get all restaurants in database
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    }= {}) {
        let query
        if (filters) {
            // search by name, cuisine, zipcode
            if ("name"  in filters) {
                // specify in monogodb atlas if someone does search via text 
                query = {$text: { $search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: fitlers["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor
         
        try {
            curssor = await restaurants
            .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0}
        }

        // If no error; default to 20 pages
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            // set above to an array
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            
            // return restaurants list and total number of restaurants
            return {restaurantsList, totalNumRestaurants}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
}