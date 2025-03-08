const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('efreiflix-db.json');
const middlewares = jsonServer.defaults();

//  Activer CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware JSON Server
server.use(middlewares);
server.use(router);

//  Démarrer le serveur
const PORT = 2066;
server.listen(PORT, () => {
    console.log(`📡 JSON Server is running on http://localhost:${PORT}`);
});
