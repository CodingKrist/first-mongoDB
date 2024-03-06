const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const app = express();

const connectionString = 'mongodb+srv://condingkrist:codingkrist@cluster0.dya8dlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Conectar a la base de datos antes de iniciar el servidor
MongoClient.connect(connectionString)
    .then(client => {

        console.log('Connected to Database');

        // Configurar el cliente de MongoDB en la aplicación Express
        const db = client.db('star-wars');
        const quotesCollection = db.collection('quotes');

        // Configurar Express
        app.use(bodyParser.urlencoded({ extended: true }));

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.post('/quotes', (req, res) => {
            quotesCollection
              .insertOne(req.body)
              .then(result => {
                res.redirect('/')
                //console.log(result); te indica que se ha enviado o no
              })
              .catch(error => console.error(error));
        })

        app.listen(3000, () => {
          console.log('Listening on 3000');
        });

    })

    .catch(error => console.error(error));

