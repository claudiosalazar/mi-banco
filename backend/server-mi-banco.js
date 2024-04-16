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

// Datos geograficos usuario
app.get('/backend/data/regiones-ciudad-comuna.json', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'regiones-ciudad-comuna.json');
  const fileData = fs.readFileSync(filePath);
  res.send(JSON.parse(fileData));
});

// Datos agenda
app.get('/backend/data/agenda-usuarios-transferencias.json', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'agenda-usuarios-transferencias.json');
  const fileData = fs.readFileSync(filePath);
  res.send(JSON.parse(fileData));
});

// Datos seguros
app.get('/backend/data/seguros-usuario.json', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'seguros-usuario.json');
  const fileData = fs.readFileSync(filePath);
  res.send(JSON.parse(fileData));
});

// Datos cartolas
app.get('/backend/data/cartolas-historicas.json', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'cartolas-historicas.json');
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

// Elimina destinatario de agenda
app.delete('/backend/data/agenda-usuarios-transferencias.json', (req, res) => {
  const id = String(req.query.id);
  const filePath = path.join(__dirname, 'data', 'agenda-usuarios-transferencias.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      res.status(500).send('Error al leer los datos');
      return;
    }

    const agenda = JSON.parse(data);

    if (Array.isArray(agenda)) {
      const index = agenda.findIndex(destinatario => destinatario.id === id);

      if (index !== -1) {
        agenda.splice(index, 1);

        fs.writeFile(filePath, JSON.stringify(agenda, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error al guardar los datos:', err);
            res.status(500).send('Error al guardar los datos');
            return;
          }

          console.log('El destinatario fue eliminado correctamente');
          res.status(200).send('El destinatario fue eliminado correctamente');
        });
      } else {
        res.status(404).send('ID no encontrado');
      }
    } else {
      console.error('Error: los datos leídos del archivo no son un array');
      res.status(500).send('Error al leer los datos');
    }
  });
});

// Actualiza los datos de usuario
app.put('/backend/data/datos-usuario.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'datos-usuario.json');
  const datosUsuarioEditado = req.body; // req.body ya es un objeto JavaScript

  // Leer el archivo existente
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo:', err);
      res.status(500).send(`Error leyendo el archivo: ${err}`);
      return;
    }

    const datosActuales = JSON.parse(data);

    // Actualiza los datos con los nuevos datos recibidos
    Object.assign(datosActuales.datosUsuario, datosUsuarioEditado);

    // Escribe el nuevo JSON al archivo
    fs.writeFile(filePath, JSON.stringify(datosActuales, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error escribiendo al archivo:', err);
        res.status(500).send(`Error escribiendo al archivo: ${err}`);
      } else {
        console.log('Datos de usuario actualizados con éxito');
        res.status(200).send('Datos de usuario actualizados con éxito');
      }
    });
  });
});

// Guarda un nuevo destinatario en la agenda
app.put('/backend/data/agenda-usuarios-transferencias.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'agenda-usuarios-transferencias.json');
  const destinatarioActualizado = req.body; // req.body ya es un objeto JavaScript

  // Leer el archivo existente
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo:', err);
      res.status(500).send(`Error leyendo el archivo: ${err}`);
      return;
    }

    const datosActuales = JSON.parse(data);

    // Busca el destinatario existente por su ID
    const index = datosActuales.findIndex(d => d.id === destinatarioActualizado.id);

    if (index !== -1) {
      // Si el destinatario existe, actualiza sus datos
      datosActuales[index] = destinatarioActualizado;
    } else {
      // Si el destinatario no existe, agrega el nuevo destinatario al final del array
      datosActuales.push(destinatarioActualizado);
    }

    // Escribir el nuevo JSON al archivo
    fs.writeFile(filePath, JSON.stringify(datosActuales, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error escribiendo al archivo:', err);
        res.status(500).send(`Error escribiendo al archivo: ${err}`);
      } else {
        console.log('El server guardo los datos en el json');
        console.log('Datos actualizados guardados con éxito');
        res.status(200).send('El server guardo los datos en el json');
      }
    });
  });
});

// Actualiza los datos de productos
app.put('/backend/data/productos-usuario.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'productos-usuario.json');
  const nuevosDatos = req.body;
  
  // Lee los datos actuales del archivo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      res.status(500).send('Error al leer los datos');
      return;
    }

    const productosUsuario = JSON.parse(data);
    Object.assign(productosUsuario, nuevosDatos);

    // Actualiza los productos con los datos recibidos
    if (req.body.productos && Array.isArray(req.body.productos)) {
      req.body.productos.forEach(productoActualizado => {
        const producto = productosUsuario.productos.find(producto => producto.id === productoActualizado.id);
        if (producto) {
          // Actualiza el producto
          Object.assign(producto, productoActualizado);
        }
      });
    } else {
      console.error('req.body.productos es undefined o no es un array');
    }

    // Guarda los datos actualizados en el archivo
    const datosCombinados = {...productosUsuario, ...nuevosDatos};

    fs.writeFile(filePath, JSON.stringify(datosCombinados, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar los datos:', err);
        res.status(500).send('Error al guardar los datos');
        return;
      } else {
        console.log('El server guardo los datos en el json');
        res.status(200).send('El server guardo los datos en el json');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});