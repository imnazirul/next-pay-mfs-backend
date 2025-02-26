import {config} from "dotenv"

config()

export const {NODE_ENV, DB_URI, PORT, JWT_SECRET, JWT_EXPIRES_IN} =  process.env