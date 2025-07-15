"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("./generated/prisma");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const port = 3000;
const app = (0, express_1.default)();
const prisma = new prisma_1.PrismaClient();
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: 'asc'
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});
app.post('/movies', async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        //Verificando se há um filme com o mesmo título
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: 'insensitive' }
            }
        });
        if (movieWithSameTitle) {
            return res.status(409).send({ message: "Movie already exists" });
        }
        //Criando o filme
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            }
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error creating movie" });
    }
    res.status(201).send({ message: "Movie created" });
});
//atualizando dados de um filme
app.put("/movies/:id", async (req, res) => {
    // pegar o id do registro que vai ser atualizado
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id
            }
        });
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        const data = { ...req.body };
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;
        // pegar os dados que vão ser atualizados
        await prisma.movie.update({
            where: {
                id
            },
            data: data
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error updating movie" });
    }
    // retornar o status correto informando que o filme foi atualizado
    return res.status(200).send({ message: "Movie updated" });
});
// deletando um filme
app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        // Verifica se o filme existe antes de tentar deletar
        const movie = await prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        await prisma.movie.delete({
            where: {
                id
            }
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error deleting movie" });
    }
    return res.status(200).send({ message: "Movie deleted" });
});
// filtrar filmes por gênero
app.get("/movies/:genreName", async (req, res) => {
    // filtrar os filmes do banco pelo gênero
    try {
        const moviesFiltered = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: {
                        equals: req.params.genreName,
                        mode: 'insensitive' // Ignora maiúsculas e minúsculas
                    }
                }
            }
        });
        // retornar os filmes
        res.status(200).send(moviesFiltered);
    }
    catch (error) {
        return res.status(500).send({ message: "Error fetching movies by genre" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
