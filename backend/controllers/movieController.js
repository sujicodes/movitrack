import { deleteMovie, appendToWatchedMovie, addMovie } from '../models/movie.js';


export const handleAddMovie = async (req, res) => {
    const { type, data } = req.body;

    try {
        const result = await addMovie(type, data);

        switch (result.status) {
            case 'exists_in_current_table':
                return res.status(400).json({ error: `Movie already exists in the ${result.table}.` });

            case 'exists_in_other_table':
                return res.status(400).json({ error: `Movie already exists in the other table (${result.table}).` });

            case 'inserted':
                return res.status(201).json({ success: true, movieId: result.movieId });

            default:
                return res.status(500).json({ error: 'Unexpected error occurred' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const handleAppendToWatchedMovie = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await appendToWatchedMovie(id);

        switch (result.status) {
            case 'exists':
                return res.status(409).json({ error: 'Movie already exists in watched movies.' });

            case 'success':
                return res.status(201).json({ success: true });

            default:
                return res.status(500).json({ error: 'Unexpected error occurred' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const handleDeleteMovie = async (req, res) => {
    const { type, id } = req.body;

    try {
        const result = await deleteMovie(type, id);

        if (result.status === 'success') {
            return res.status(201).json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid type' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
