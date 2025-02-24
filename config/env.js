import {config} from "dotenv"

config({path: `.env.${process.env.NODE_ENV || "production"}.local`})

export const {NODE_ENV, DB_URI, PORT} =  process.env