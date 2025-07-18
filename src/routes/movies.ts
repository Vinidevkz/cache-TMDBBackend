import {Router, Request, Response} from "express"
import axios from "axios";

const router = Router()

//rota GET para todos os filmes: /api/movies/
router.get("/", (req: Request, res: Response) => {
    res.json({message: "Lista de filmes"})
})

//rota GET para um titulo unico: /api/movies/:title
router.get("/:title", async (req: Request, res: Response) => {
    const {title} = req.params

    try {
        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params:{
                api_key: process.env.TMDB_API_KEY,
                query: title
            }
        })
        res.json(response.data)
    } catch (error) {
        res.status(500).json({error: "Erro ao buscar o filem desejado."})
    }

})

export default router