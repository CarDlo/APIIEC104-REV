import "reflect-metadata"
import app from "./app"
import { AppDataSource } from "./db"

async function main() {

    const port = process.env.PORT || 3000
    try {
        await AppDataSource.initialize();
        console.log("Database connected");
        app.listen(port);
        //console.log("Server running on port 3000");
    } catch (error) {
        console.log(error);
    }


}
main();


