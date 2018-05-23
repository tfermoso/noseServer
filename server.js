var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');

var app = express();
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);
app.use(urlencodedParser);

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'master',
  password: 'bvIRWz1PD2Ajyv9J',
  database: 'tareasDB'
});
connection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log('Conexion correcta con el servidor.');
  }
});


app.post('/', function (req, res) {
  console.log("petición recibida");
  var nomb = req.body.nombre || '';
  var tar = req.body.tarea || '';
  var nuevaTarea = { nombre: nomb, tarea: tar };

  connection.query('INSERT INTO tareas (nombre, tarea) VALUES(?, ?)', [nomb, tar], function (error, result) {
    if (error) {
      throw error;
    } else {
      console.log(result);
      res.redirect('/');
    }
  }
  );
});

app.get('/', function (req, res) {
  console.log("petición recibida en tareas");
  connection.query("select * from tareas", function (err, result) {
    fs.readFile('./www/Tareas/index.html', 'utf8', function (err, text) {

      var fila = cargarTareas(result)

      text = text.replace("[sustituir]", fila);
      res.send(text);
    });
  })

  //res.send('hello '+nombre);
});


app.get('/eliminar/:id?', function (req, res) {
  console.log("Eliminando registro " + req.query.id);
  connection.query("DELETE from tareas WHERE id = ?", [req.query.id], function (err, result) {
    console.log("Record Deleted!!");
    //console.log(result);
    res.redirect('/');
  });
});

app.get('/editar/:id?', function (req, res) {
  connection.query("Select * from tareas", function (err, result) {
    var registroEditar;
    console.log(result);
    for (const tarea of result) {
      if (tarea.id == req.query.id) {
        registroEditar = tarea;
      }
    }
    fs.readFile('./www/Tareas/index.html', 'utf8', function (err, text) {
      var fila = cargarTareas(result);
      var nombre = registroEditar.nombre;
      var tarea = registroEditar.tarea;
      text = text.replace("[sustituir]", fila);
      text = text.replace('action="/"', 'action="/editar"');
      text = text.replace("[id_editar]", req.query.id);
      text = text.replace('placeholder="Nombre de usuario"', 'value="' + nombre + '"');
      text = text.replace('placeholder="Nombre de la tarea"', 'value="' + tarea + '"');
      res.send(text);
    });

  });

});

app.post('/editar', function (req, res) {

  var nomb = req.body.nombre || '';
  var tar = req.body.tarea || '';
  var id = req.body.id;

  connection.query("UPDATE tareas SET nombre=?, tarea=? WHERE id = ?", [nomb, tar, id], function (error, resultado) {
    if (error) {
      console.log(error);
    } else {
      console.log(resultado);
      res.redirect('/');
    }
  })
});



app.use(express.static('www/Tareas'));


var server = app.listen(8080, function () {
  console.log('Servidor web iniciado');
});



function cargarTareas(tareas) {

  var lista = "";
  for (var indice in tareas) {
    var fila = `
      <tr>
          <td>[id]</td>
          <td>[nombre]</td>
          <td>[tarea]</td>
          <td>
            <a href="/eliminar?id=[id]">Eliminar</a>
            <a href="/editar?id=[id]">Editar</a>
          </td>
      </tr>
      `;

    fila = fila.split("[id]").join(tareas[indice].id);

    fila = fila.replace("[nombre]", tareas[indice].nombre);
    fila = fila.replace("[tarea]", tareas[indice].tarea);
    lista += fila;
  }
  return lista;
}


