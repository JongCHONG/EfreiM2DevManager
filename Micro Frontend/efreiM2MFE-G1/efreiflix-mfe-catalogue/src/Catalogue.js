import React, { useEffect, useState, useRef } from 'react';
import './styles.css';

const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

const Catalogue = () => {

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const rowRefs = useRef({});

    useEffect(() => {
        const fetchCatalogue = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR`
                );
                const data = await response.json();
                if (data.results) setMovies(data.results);
            } catch (err) {
                console.error("Erreur de chargement :", err);
            }
        };

        fetchCatalogue();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (err) {
                console.error("Erreur lors de la récupération des genres :", err);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        if (genres.length === 0) return;

        const fetchMoviesByGenre = async () => {
            const newMoviesByGenre = {};

            for (const genre of genres) {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&with_genres=${genre.id}`
                    );
                    const data = await response.json();
                    newMoviesByGenre[genre.name] = data.results.slice(0, 15);
                } catch (err) {
                    console.error(`Erreur lors de la récupération des films pour le genre ${genre.name} :`, err);
                }
            }

            setMoviesByGenre(newMoviesByGenre);
        };

        fetchMoviesByGenre();
    }, [genres]);

    // 🔥 Fonction pour défiler horizontalement
    const scroll = (genre, direction) => {
        if (rowRefs.current[genre]) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            rowRefs.current[genre].scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* 🔥 Section des dernières sorties */}
                <h2 className="text-4xl font-bold mb-6">Nos dernières sorties</h2>
                <div className="relative">
                    <div className="flex overflow-x-auto scrollbar-hide space-x-6">
                        {movies.map((movie) => (
                            <div key={movie.id} className="relative w-56 h-80 flex-shrink-0 group">
                                {/* Image */}
                                <img
                                    className="object-cover cursor-pointer object-center h-full w-full rounded-xl transition-all duration-300"
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                />
                                {/* Overlay au survol */}
                                <div className="absolute inset-0 w-full h-full bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-4 rounded-lg">                                    <h3 className="text-lg font-semibold">{movie.title}</h3>
                                    <p className="text-sm text-gray-300 mb-1">
                                        {movie.release_date ? movie.release_date.split("-")[0] : "Date inconnue"}
                                    </p>

                                    {/* 🔥 Description plus longue avec gestion des dépassements */}
                                    <p className="text-md text-gray-300 mt-2 overflow-hidden line-clamp-10">
                                        {movie.overview ? movie.overview : "Aucune description disponible."}
                                    </p>
                                    <p className="text-sm text-yellow-400 font-bold mb-2">
                                        ⭐ {movie.vote_average} / 10
                                    </p>
                                    <a
                                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full text-center"
                                    >
                                        Voir le film
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔥 Section des films par genre */}
                {genres.map((genre) => (
                    <div key={genre.id} className="mt-12 relative">
                        <h2 className="text-3xl font-bold mb-4">{genre.name}</h2>

                        {/* Flèches de navigation */}
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
                            onClick={() => scroll(genre.name, 'left')}
                        >
                            ◀
                        </button>
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
                            onClick={() => scroll(genre.name, 'right')}
                        >
                            ▶
                        </button>

                        {/* Liste de films */}
                        <div ref={(el) => (rowRefs.current[genre.name] = el)} className="flex overflow-x-auto scrollbar-hide space-x-6">
                            {moviesByGenre[genre.name]?.map((movie) => (
                                <div key={movie.id} className="relative w-56 h-80 flex-shrink-0 group">
                                    <img
                                        className="object-cover cursor-pointer object-center h-full w-full rounded-xl transition-all duration-300"
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-xl">
                                        <h3 className="text-2xl font-bold">{movie.title}</h3>
                                        <p className="text-sm text-gray-400">{movie.release_date ? movie.release_date.split("-")[0] : "Date inconnue"}</p>

                                        {/* 🔥 Description plus longue avec gestion des dépassements */}
                                        <p className="text-md text-gray-300 mt-2 overflow-hidden line-clamp-10">
                                            {movie.overview ? movie.overview : "Aucune description disponible."}
                                        </p>

                                        <div className="text-yellow-400 text-lg font-bold mt-2">⭐ {movie.vote_average} / 10</div>

                                        <a
                                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-center"
                                        >
                                            Voir le film
                                        </a>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Catalogue;
