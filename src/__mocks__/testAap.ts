import express, { Application } from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import RoutesV1 from "../api/v1/routes"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import path from "path"
import { errorHandler, notFound } from "../api/v1/middlewares/error_handler"
import { IN_PROD } from "../config/app"

const app: Application = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.disable("x-powered-by")
if (!IN_PROD) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 60 requests per windowMs
})

app.use(apiRequestLimiter)

app.use("/", RoutesV1)

app.use(notFound, errorHandler)

process.on("uncaughtException", function (err) {
  console.error(err)
  console.log("Node NOT Exiting...")
})

export default app
