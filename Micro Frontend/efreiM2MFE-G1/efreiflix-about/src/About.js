import React, { useEffect, useState } from "react";

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    //we should fix this localhost 2066
    //  fetch("http://localhost:2066/about") // Fetch about info from json-server
    //       .then((res) => res.json())
    //       .then((data) => setAbout(data))
    //       .catch((err) => console.error("Failed to load about info:", err));
    // Mock data until backend is ready
    const mockData = {
      description: "EfreiFlix est une plateforme de streaming développée par les étudiants d'EFREI Paris. Notre mission est de fournir une expérience de visionnage fluide et agréable.",
      version: "1.0.0",
      team: "Groupe 1 - L3 2024"
    };
    setAbout(mockData);
  }, []);

  if (!about) return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6  shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">À propos d'EfreiFlix</h1>
      <p className="text-gray-700">{about.description}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Version:</strong> {about.version}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Équipe:</strong> {about.team}
        </p>
      </div>
    </div>
  );
};

export default About;
