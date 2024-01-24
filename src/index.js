import express from "express"
import cors from "cors"
import universidadesRutas from "./routes/universidades.routes.js"
import fileUpload from "express-fileupload"

const app = express()

app.use(cors())

app.use(express.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

app.use('/api', universidadesRutas)

//Puerto de la app
const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor funciona en el puerto ${port}`)
})