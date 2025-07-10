import express from 'express';
import { PrismaClient } from './generated/prisma';
import { release } from 'os';
import { RetryAgent } from 'undici-types';

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware to parse JSON bodies

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
    } catch (error) {
        return res.status(500).send({ message: "Error creating movie" });
    }

    res.status(201).send('Movie created');
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
    } catch (error) {
        return res.status(500).send({ message: "Error updating movie" });
    }
    // retornar o status correto informando que o filme foi atualizado
    res.status(200).send()
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});