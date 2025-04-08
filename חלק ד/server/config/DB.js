import { connect } from "mongoose";

export function connectToDB() {
    connect(process.env.URL).then(con => console.log("mongo DB connected"))
        .catch(err => {
            console.log("cannot connect mongo DB " + err)
            process.exit(1)
        })

}