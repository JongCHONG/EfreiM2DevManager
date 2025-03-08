import React, { useState, useEffect } from "react";
import axios from "axios";
import Catalogue from "./Catalogue";
import "./styles.css";

const API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb";

const RandomMovie = () => {
  // etat pour stocker le film sélectionné
  const [selectedMovie, setSelectedMovie] = useState(null);

  // etat pour gérer le son
  const [isMuted, setIsMuted] = useState(true);
  const [player, setPlayer] = useState(null);

  // récupérer un film aléatoire via TMDb
  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        // récupérer les films
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`
        );

        // Sélectionner un film aléatoire
        const randomMovie =
          response.data.results[
            Math.floor(Math.random() * response.data.results.length)
          ];

        // récupérer la bande-annonce
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${API_KEY}&language=fr-FR`
        );
        const trailer = trailerResponse.data.results.find(
          (video) => video.type === "Trailer"
        );

        // mettre à jour l'état avec les infos du film et le trailer
        setSelectedMovie({
          title: randomMovie.title,
          description: randomMovie.overview,
          trailerUrl: trailer
            ? `https://www.youtube.com/embed/${trailer.key}`
            : null, // 🔥 Si pas de trailer, mettre null
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du film :", error);
      }
    };

    fetchRandomMovie();
  }, []);

  useEffect(() => {
    if (!selectedMovie || !selectedMovie.trailerUrl) return;

    const loadYouTubeAPI = () => {
      if (window.YT) {
        initPlayer();
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = initPlayer;
        document.body.appendChild(tag);
      }
    };

    const initPlayer = () => {
      const newPlayer = new window.YT.Player("youtube-player", {
        videoId: selectedMovie.trailerUrl.split("/embed/")[1],
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: selectedMovie.trailerUrl.split("/embed/")[1],
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setPlayer(event.target);
          },
        },
      });
    };

    loadYouTubeAPI();
  }, [selectedMovie]);

  // 🔊 activer/désactiver le son
  const toggleSound = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // 🎬 afficher un message de chargement tant que le film n'est pas prêt
  if (!selectedMovie) {
    return (
      <div className="text-white text-center text-2xl mt-20">
        🎬 Chargement du film...
      </div>
    );
  }

  return (
    <>
      <div className="catalogue">
        {/* hero Section avec bande-annonce en arrière-plan */}
        <div className="hero-section relative w-full h-[80vh] flex items-center justify-start pl-16 overflow-hidden">
          {/* vidéo YouTube en arrière-plan */}
          <div className="absolute top-0 left-0 w-full h-full">
            {selectedMovie.trailerUrl ? (
              <div
                id="youtube-player"
                className="w-full h-full pointer-events-none"
              ></div>
            ) : (
              <div className="text-white text-2xl flex items-center justify-center h-full">
                🎥 Pas de bande-annonce disponible
              </div>
            )}
          </div>

          {/* overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* bouton activer/désactiver le Son */}
          <button
            onClick={toggleSound}
            className="absolute bottom-10 left-10 bg-white text-black py-2 px-4 rounded-lg shadow-lg font-bold flex items-center"
          >
            {isMuted ? "🔇 Activer le son" : "🔊 Couper le son"}
          </button>

          {/* infos du film */}
          <div className="hero-info relative z-10 text-white max-w-[600px]">
            <p className="text-gray-300 text-lg mb-2">Disponible maintenant</p>
            <h1 className="text-6xl font-bold leading-tight">
              {selectedMovie.title}
            </h1>
            <p className="mt-4 text-lg">{selectedMovie.description}</p>

            {/* bouton pour lancer le film */}
            <div className="mt-6">
              <button className="bg-red-600 text-white py-3 px-6 text-lg font-bold rounded shadow-lg hover:bg-red-700 transition">
                ▶️ Regarder
              </button>
            </div>
          </div>
        </div>
      </div>
      <Catalogue />
    </>
  );
};

export default RandomMovie;
