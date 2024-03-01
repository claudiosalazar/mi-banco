const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));

// Habilita el middleware bodyParser.json()
app.use(bodyParser.json());

// Sirve los archivos estáticos en la carpeta backend/data
app.use('/backend/data', express.static(path.join(__dirname, 'backend/data')));

app.post('/data', (req, res) => {
  const datos = req.body;
  // Escribe los datos en datos-usuario.json
  // fs.writeFileSync('data/datos-usuario.json', JSON.stringify(datos, null, 2)); 

  const directoryPath = path.join(__dirname, 'data');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 
    let data = [];
    files.forEach((file) => {
      if(path.extname(file) === '.json') {
        const filePath = path.join(directoryPath, file);
        const fileData = fs.readFileSync(filePath);
        data.push(JSON.parse(fileData));
      }
    });
    res.send(data);
  });
});

// Datos usuario
app.get('/backend/data/datos-usuario.json', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'datos-usuario.json');
  const fileData = fs.readFileSync(filePath);
  res.send(JSON.parse(fileData));
});

// Datos productos
app.get('/backend/data/productos-usuario.json', (req, res) => {
  const id = Number(req.query.id);
  const filePath = path.join(__dirname, 'data', 'productos-usuario.json');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (id) {
    if (fileData.productosUsuario) {
      const producto = fileData.productosUsuario.find(producto => Number(producto.id) === id);
      if (producto) {
        res.send(producto);
      } else {
        res.status(404).send('ID no encontrado');
      }
    } else {
      res.status(404).send('No se encontraron los datos del producto');
    }
  } else {
    res.send(fileData);
  }
});

// Datos ofertas
app.get('/backend/data/ofertas-productos.json', (req, res) => {
  const id = req.query.id;
  const filePath = path.join(__dirname, 'data', 'ofertas-productos.json');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (id) {
    if (fileData.ofertasProductos) {
      const oferta = fileData.ofertasProductos.find(oferta => oferta.id === id);
      if (oferta) {
        res.send(oferta);
      } else {
        res.status(404).send('ID no encontrado');
      }
    } else {
      res.status(404).send('No se encontraron ofertas');
    }
  } else {
    res.send(fileData);
  }
});

// Datos seguros
app.get('/backend', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'seguros-usuario.json');
  const fileData = fs.readFileSync(filePath);
  res.send(JSON.parse(fileData));
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});