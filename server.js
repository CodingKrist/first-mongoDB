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
        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({ extended: true })); //para leer datos de form

        app.use(express.static('public')) //para acceder a los PUT (update)

        app.use(bodyParser.json()) // para leer JSON

        app.get('/', (req, res) => {
            //Obtengo la info de la coleccion quotes y la renderizo
            db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })    
                })
                .catch(error => {
                    console.error('Error fetching quotes from the database:', error);
                })
            //Seguidamente respondo con el archivo index   
            //res.sendFile(__dirname + '/index.html');
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

        app.put('/quotes', (req, res) => {
            quotesCollection
                .findOneAndUpdate(
                  { name: 'Yoda' },
                  {
                    $set: {
                      name: req.body.name,
                      quote: req.body.quote,
                    },
                  },
                  {
                    upsert: true,
                  }
                )
                .then(result => {
                    res.json('Success')
                   })
                .catch(error => console.error(error))
        })  
        
        app.delete('/quotes', (req, res) => {
            quotesCollection
              .deleteOne({ name: req.body.name })
              .then(result => {
                if (result.deletedCount === 0) {
                  return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vader's quote`)
            })    
              .catch(error => console.error(error))
          })

        app.listen(3000, () => {
          console.log('Listening on 3000');
        });

    })

    .catch(error => console.error(error));

