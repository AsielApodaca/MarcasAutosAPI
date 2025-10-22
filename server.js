import express from 'express';
import fs from 'fs';
import cors from 'cors'; // Agrega esta línea
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 8888;

// Crear __dirname manualmente (solo necesario en ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// siglas de Cross-Origin Resource Sharing (compartir recursos entre orígenes cruzados),
// es un mecanismo de seguridad implementado en los navegadores web para controlar
// las solicitudes de recursos web (como archivos JavaScript, CSS, imágenes, etc.)
// que se hacen entre diferentes dominios.
app.use(cors());

app.get('/marcas', (req, res) => {
    // Servir el archivo de marcas
    fs.readFile(__dirname + '/marcas.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error interno del servidor');
        } else {
            res.set('Content-Type', 'text/plain');
            res.send(data);
        }
    });
});

app.get('/modelos/:marca', (req, res) => {
    const marcaParam = req.params.marca; // Obtener la marca desde la URL

    fs.readFile(__dirname + '/modelos.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error interno del servidor');
        } else {
            const modelos = data.split('\n');
            const modelosFiltrados = modelos.filter(modelo => modelo.startsWith(marcaParam));
            
            if (modelosFiltrados.length === 0) {
                res.status(404).send('No se encontraron modelos para la marca especificada');
            } else {
                res.set('Content-Type', 'text/plain');
                res.send(modelosFiltrados.join('\n'));
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${port}`);
});