import {config} from "dotenv"

config({path: `.env.${process.env.NODE_ENV || "production"}`})

export const {NODE_ENV, DB_URI} =  process.env