import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import {MongoClient, Db} from 'mongodb';
import {Usuarios} from './Usuarios';
import {Productos} from './Productos'
import {Categorias} from './Categorias';
import {Apartados} from './Apartados';
import {Conteo} from './Conteo';

class App {
  public express 
  private client : MongoClient
  private db : Db



  constructor () {
    const url = 'mongodb://localhost:27017'
    const dbName = 'zxc';

    this.express = express()
    this.express.use(bodyParser.urlencoded({extended: true}));
    this.express.use(bodyParser.json());
    
    this.express.use(express.static(path.join(__dirname, '../../zxc/build/')));

    this.client = new MongoClient(url, {useNewUrlParser: true});

    this.client.connect((err) => {
        this.db = this.client.db(dbName)

       /* this.db.collection('productos').find({apartados: { $elemMatch: {
          activo: false
        }}}).toArray((err, docs) => {
          console.log(docs[0]);
        })*/



        console.log("Server connected to db..");

        this.mountRoutes();
    });

  }

  private mountRoutes (): void {    

    let usuarios = new Usuarios(this.express, this.db);
    let categorias = new Categorias(this.express, this.db);
    let productos = new Productos(this.express, this.db);

    let apartados = new Apartados(this.express, this.db);
    let conteo = new Conteo(this.express, this.db);
  }
}

export default new App().express