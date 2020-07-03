import {MongoClient} from 'mongodb';
import { Db } from 'mongodb';


import * as path from 'path';
import * as multer from 'multer';
import * as xlsx from 'xlsx';


const upload 	= multer({dest: path.join(__dirname, 'pdf/')});



export class Categorias {
    private app
    private db:Db

    constructor(expressApp: Express.Application, database: Db) {
        this.app = expressApp;
        this.db = database;

        this.mountRoutes();
    }

    private nuevo(req, res) {
        let categorias = this.db.collection('categorias');

        categorias.insertOne({nombre: req.body.nombre})

        res.sendStatus(200);
    }

    private modificar(req, res) {
        let categorias = this.db.collection('categorias');
        categorias.updateOne({nombre: req.body.nombre}, { $set: {
            nombre: req.body.nuevoNombre
        }})
        console.log(req.body)
        res.sendStatus(200);
    }

    private obtener(req, res) {
        let categorias = this.db.collection('categorias');

        categorias.find({}).toArray((err, docs) => {
            res.send(JSON.stringify(docs));
        })
    }

    private guardarExcel(req, res) {
        if(req.file.mimetype != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            res.send({error: 'No es un archivo de excel'})
            return;
        }

        let libro = xlsx.readFile(req.file.path);

        if(!libro.Sheets.ProductosInventario) {
            res.send({error: 'El archivo no contiene la hoja "ProductosInventario"'})
            return;
        }

        res.send({archivo: req.file.filename})
    }
  
    
    public mountRoutes() : void {

        this.app.post('/categorias/nuevo', this.nuevo.bind(this));
        this.app.post('/categorias/modificar', this.modificar.bind(this));
        this.app.post('/categorias/subirArchivo', upload.single('archivo'), this.guardarExcel)

        this.app.get('/categorias/obtener', this.obtener.bind(this));
    }
}