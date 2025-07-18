//Projeto Backend feito em NodeJS, junto ao TypeScript,
//Express e a API de filmes do MDB.
//
//Vinicius Eduardo , 2025.

//express config
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

//dotenv config
import dotenv from "dotenv"
dotenv.config()

import routes from "./routes"

//starting server
app.use("/api", routes)
app.listen(port, () => {
    console.log(`-> Servidor rodando na porta: ${port}`)
})


