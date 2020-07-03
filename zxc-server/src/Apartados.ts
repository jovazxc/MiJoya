import {MongoClient,  ObjectId} from 'mongodb';
import { Db } from 'mongodb';

import * as path from 'path';
import * as multer from 'multer';
import * as xlsx from 'xlsx';


const upload 	= multer({dest: path.join(__dirname, 'pdf/')});


export class Apartados {
    private app
    private db:Db

    constructor(expressApp: Express.Application, database: Db) {
        this.app = expressApp;
        this.db = database;

        
        this.mountRoutes();


    }
    nuevo = (req, res) => {
        let apartados = this.db.collection('apartados');

        apartados.insertOne({nombre: req.body.nombre, productos: req.body.productos, activo: true});
        res.sendStatus(200);
    }

    concluir = (req, res) => {
        let apartados = this.db.collection('apartados');

        apartados.updateOne({nombre: req.body.nombre, activo: true}, { $set: {activo: false}});
		res.sendStatus(200);
    }
	
	obtener = (req, res) => {
		let apartados = this.db.collection('apartados');
		apartados.find({activo: true}).toArray((err, docs) => {
			res.send(JSON.stringify(docs));
		});
		
		
	}

	compararExcel(req, res) {
        if(req.file.mimetype != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            res.send({error: 'No es un archivo de excel'})
            return;
        }
        let libro = xlsx.readFile(req.file.path);
		

        if(!libro.Sheets.Reporte) {
            res.send({error: 'El archivo no contiene la hoja "ProductosInventario"'})
            return;
        }
		
		let hoja = libro.Sheets.Reporte
		
		
		let c = 0; 
		let rows = []
		for(let rc in hoja) {
			if(rc[0] === '!') continue;
			if(!rows[rc.substring(1)]) {
				rows[rc.substring(1)] = true;
				c++;
			}
		}
		
		let diff = []
		for(let i = 2; i<=c; i++) {
			let codigo = hoja[`A${i}`].v
			let ex1 = hoja[`F${i}`].v * 1
			let ex2 = hoja[`G${i}`].v * 1
			
			if(ex1 != ex2) {
				diff.push(codigo.toString());
			}
		}
		
		let totales = []		
		let apartados = this.db.collection('apartados');
		
		apartados.find({"productos.codigo": {$in: diff}, activo: true}).toArray((err, docs) => {
	
			for(let i = 0; i<docs.length; i++) {
				for(let d = 0; d<docs[i].productos.length; d++) {
					if(totales[`t${docs[i].productos[d].codigo}`])
						totales[`t${docs[i].productos[d].codigo}`] += docs[i].productos[d].cantidad*1
					else
						totales[`t${docs[i].productos[d].codigo}`] = docs[i].productos[d].cantidad*1
				}
			}
			
			let nuevototales = []
			for(let c in totales) {
				nuevototales.push({codigo: c.substring(1), cantidad: totales[c]});
			}
			
			res.send(nuevototales);
		});
	
		
		
		
    }
	
	

    mountRoutes = () => {
        this.app.post('/apartados/nuevo', this.nuevo.bind(this))
        this.app.post('/apartados/concluir', this.concluir.bind(this));
		this.app.post('/apartados/compararExcel', upload.single('archivo'), this.compararExcel.bind(this))
		this.app.get('/apartados/obtener', this.obtener.bind(this));
		

    }

}