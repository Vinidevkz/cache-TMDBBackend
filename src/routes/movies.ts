import {Router, Request, Response} from "express"
import axios from "axios";

//Cache config
import { LRUCache } from "../cache/LRUCache"
const movieCache = new LRUCache<any>(5)

const router = Router()

/*rota GET para todos os filmes: /api/movies/
router.get("/", (req: Request, res: Response) => {
    res.json({message: "Lista de filmes"})
})
*/

//rota GET para um titulo unico: /api/movies/:title
router.get("/:title", async (req: Request, res: Response) => {
    const {title} = req.params
    const key = title.toLowerCase()

    //verificação do cache
    const cached = movieCache.get(key)
    if(cached) {
        return res.json({fromCache: true, data: cached})
    }

    //busca na api caso falso
    try {
        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params:{
                api_key: process.env.TMDB_API_KEY,
                query: title
            }
        })

        //guarda no cache
        movieCache.put(key, response.data)
        res.json({fromCache: false, data: response.data})
    } catch (error) {
        res.status(500).json({error: "Erro ao buscar o filem desejado."})
    }

})

router.get("/", (req: Request, res: Response) => {
    res.json({cacheKeys: movieCache.showCache() })
})

export default router