import {config} from "dotenv"

config({path: `.env.${process.env.NODE_ENV}`})

export const {NODE_ENV} =  process.env