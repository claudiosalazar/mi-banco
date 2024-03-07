const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

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
    const producto = fileData.productos.find(producto => Number(producto.id) === id);
    if (producto) {
      res.send({ productos: [producto] }); 
    } else {
      res.status(404).send('ID no encontrado');
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

// Actualiza los datos de productos
app.put('/backend/data/productos-usuario.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'productos-usuario.json');
  
  // Lee los datos actuales del archivo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      res.status(500).send('Error al leer los datos');
      return;
    }

    const productosUsuario = JSON.parse(data);

    // Actualiza los productos con los datos recibidos
    if (Array.isArray(req.body.productos)) {
      // Actualiza los productos con los datos recibidos
      req.body.productos.forEach(productoActualizado => {
        const producto = productosUsuario.productos.find(producto => producto.id === productoActualizado.id);
        if (producto) {
          // Actualiza el producto
          Object.assign(producto, productoActualizado);
        }
      });
    } else {
      console.error('Error: req.body.productos debe ser un array');
      res.status(400).send('Error: req.body.productos debe ser un array');
      return;
    }

    // Guarda los datos actualizados en el archivo
    fs.writeFile(filePath, JSON.stringify(productosUsuario, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar los datos:', err);
        return;
      }
      console.log('Datos de usuario guardados con éxito');
      res.status(200).send('Datos de usuario guardados con éxito');
    });
  });
});


app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});