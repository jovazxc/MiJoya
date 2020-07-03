import {MongoClient} from 'mongodb';
import { Db } from 'mongodb';

export class Usuarios {
    private app
    private db:Db

    constructor(expressApp: Express.Application, database: Db) {
        this.app = expressApp;
        this.db = database;

        this.db.collection('usuarios').createIndex({id: 1})
        this.mountRoutes();
    }

    private obtener(req, res) {
        let usuarios = this.db.collection('usuarios');
        usuarios.find({usuario: req.query.usuario}).toArray((err, docs) => {
            if(err) throw err;

            if(docs.length > 0) {

                let respuesta = {
                    nombre: docs[0].nombre
                }

                if(req.query.detalles) {
                    respuesta = docs[0];
                }

                console.log(respuesta)
                res.json(respuesta);
            } else {
                res.json({});
            }
        })
    }
	
	private obtenerTodos(req, res) {
		let usuarios = this.db.collection('usuarios');
		usuarios.find({}).toArray((err, docs) => {
			let users = []
			for(let i = 0; i<docs.length; i++) {
				users.push(docs[i].nombre);
			}
			
			res.send(JSON.stringify(users));
			
		});
	}

    private nuevo(req, res) {
        let usuarios = this.db.collection('usuarios');
        usuarios.insertOne({usuario: req.body.usuario, nombre: req.body.nombre, contraseña: req.body.contraseña, privilegios: req.body.privilegios});

        res.sendStatus(200);
    }

    private modificar(req, res) {
        let usuarios = this.db.collection('usuarios');
        usuarios.updateOne({usuario: req.body.usuario}, { $set : {
            'nombre': req.body.nombre,
            'contraseña': req.body.contraseña,
			'privilegios': req.body.privilegios
        }})

        res.sendStatus(200);
    }

    private comprobar(req, res) { 

        let usuarios = this.db.collection('usuarios'); 
        usuarios.find({usuario: req.body.usuario, contraseña: req.body.contraseña}).toArray((err, docs) => {
            if(err) throw err;

            if(docs.length > 0) {

                let respuesta = {
                    nombre: docs[0].nombre,
					privilegios: docs[0].privilegios
                }

                res.json(respuesta);
            } else {
                res.json({});
            }
        });
    }
    public mountRoutes() : void {
        this.app.post('/usuarios/comprobar', this.comprobar.bind(this));
        this.app.post('/usuarios/nuevo', this.nuevo.bind(this));
        this.app.post('/usuarios/modificar', this.modificar.bind(this));

        this.app.get('/usuarios/obtener', this.obtener.bind(this));
		this.app.get('/usuarios/obtenerTodos', this.obtenerTodos.bind(this));
        
        
    }
}