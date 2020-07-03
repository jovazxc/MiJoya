import {MongoClient,  ObjectId} from 'mongodb';
import { Db } from 'mongodb';
import * as xlsx from 'xlsx';
import * as path from 'path';

export class Productos {
    private app
    private db:Db

    constructor(expressApp: Express.Application, database: Db) {
        this.app = expressApp;
        this.db = database;

        this.db.collection('productos').createIndex({codigo: 1}, {sparse: true, unique: true});
        this.mountRoutes();
    }


    importarExcel = (req, res) => {
        let libro = xlsx.readFile(path.join(__dirname, 'pdf/', req.body.archivo));

        if(!libro.Sheets.ProductosInventario) {
            res.send({error: 'El archivo no contiene la hoja "ProductosInventario"'})
            return;
        }

        let productos = this.db.collection('productos');
        let categorias = this.db.collection('categorias');

        categorias.findOne({nombre: req.body.categoria}).then((cat) => {
    
            let c = 0; 
            let rows = []
            for(let rc in libro.Sheets.ProductosInventario) {
                if(rc[0] === '!') continue;
                if(!rows[rc.substring(1)]) {
                    rows[rc.substring(1)] = true;
                    c++;
                }
            }
			console.log(libro)

            for(let i = 2; i<=c; i++) {
                let codigo = libro.Sheets.ProductosInventario[`A${i}`].v
                let desc = libro.Sheets.ProductosInventario[`B${i}`].v

                productos.updateOne({codigo: codigo}, { $set: {
                    desc: desc,
                    categoria: new ObjectId(cat._id)
                }}, {upsert: true});
            }
            res.send({total: c-1});
        })
        

    }

    obtenerDescripcion = (req, res) => {
        let productos = this.db.collection('productos');

        productos.findOne({codigo: req.query.codigo}).then((e) => {
            if(e == null) return res.send({});
            res.send({codigo: e.codigo, desc: e.desc});
        })


    }

    public mountRoutes() : void {
        this.app.post('/productos/importar', this.importarExcel.bind(this));
        this.app.get('/productos/descripcion', this.obtenerDescripcion.bind(this));

    }
}