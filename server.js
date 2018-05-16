var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();


var listaTareas=[];

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);
app.use(urlencodedParser);

app.use(express.static('www/Tareas'));

app.post('/', function (req, res) {
  console.log("petición recibida");
  var nomb = req.body.nombre || '';
  var tar = req.body.tarea || '';
  listaTareas.push({nombre:nomb,tarea:tar});
  //console.log(listaTareas);
  fs.readFile('./www/Tareas/index2.html', 'utf8', function (err, text) {
    var fila=cargarTareas(listaTareas);

    text = text.replace("[sustituir]", fila);
    res.send(text);
  });
  //res.send('hello '+nombre);
});

app.get('/', function (req, res) {
  console.log("petición recibida en tareas");
  
 
  fs.readFile('./www/Tareas/index2.html', 'utf8', function (err, text) {
    

    text = text.replace("[sustituir]", "");
    res.send(text);
  });
  //res.send('hello '+nombre);
});

app.post('/datos', function (req, res) {

  console.log(req.body);
  res.send("Datos recibidos");

});

app.get('/eliminar/:id?',function(req,res){
  console.log("Eliminando registro "+req.query.id);
  listaTareas.splice(req.query.id,1);
  //Eliminar registro de la colección;

  fs.readFile('./www/Tareas/index2.html', 'utf8', function (err, text) {
    var fila=cargarTareas(listaTareas);

    text = text.replace("[sustituir]", fila);
    res.send(text);
  });
});



var server = app.listen(8080, function () {
  console.log('Servidor web iniciado');
});


function cargarTareas(tareas) {
  var lista="";
  for (var indice in tareas) {
      var fila = `
      <tr>
          <td>[id]</td>
          <td>[nombre]</td>
          <td>[tarea]</td>
          <td><a href="/eliminar?id=[id]">Eliminar</a></td>
      </tr>
      `;
      fila = fila.replace("[id]", indice);
      fila = fila.replace("[id]", indice);
      fila = fila.replace("[nombre]", tareas[indice].nombre);
      fila = fila.replace("[tarea]", tareas[indice].tarea);
      lista += fila;
  }
  return lista;
}