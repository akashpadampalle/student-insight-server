import "./config/config"
import express from "express"
import  cookieParser from "cookie-parser"
import connectDB from "./config/db"
import cors from "cors"
import { logError, logExpressError, logRequest } from "./middlewares/logger"
import router from "./router/index"

const port = process.env.PORT ? Number(process.env.PORT) : 1337


connectDB()
    .then(() => {

        const app = express()
        app.use(logExpressError)
        app.use(cors(
            {
                origin: "https://student-insight-client.vercel.app/",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                credentials: true,
                allowedHeaders: ["Content-Type", "Authorization"],
            }
        ))
        app.use(logRequest)
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use('/', router)
        app.listen(port, () => console.log(`server is running at port ${port}`))


    })
    .catch((error) => {

        logError(error)
        console.log(error)

    })

