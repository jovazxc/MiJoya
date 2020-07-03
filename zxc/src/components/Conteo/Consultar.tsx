import * as React from "react";
import * as moment from "moment";

import {Input, Button, Select, Checkbox, Collapse, Icon, Modal} from "antd";
const Option = Select.Option;
const Panel = Collapse.Panel;

interface MainState {
    conteos: Array<any>;
	usuarioSelect: string;
	usuarios: Array<any>;
	categoriaSelect: string;
	categorias: Array<any>;
	
}

interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

export class Consultar extends React.Component<any, MainState> {

    constructor(props: any) {
        super(props);

        this.state = {
            conteos: new Array<any>(),
			usuarioSelect: 'Todos',
			usuarios: ['Todos'],
			categoriaSelect: 'Todas',
			categorias: ['Todas', 'Parciales']
        };
    }

    componentDidMount () {
        
		fetch('/usuarios/obtenerTodos').then((r) => r.json()).then((u) => {
			let usuarios = Array.from(this.state.usuarios);
			
			for(let i = 0; i<u.length; i++) usuarios.push(u[i]);
			this.setState({usuarios});
		});
		fetch('/categorias/obtener').then((r) => r.json()).then((c) => {
			let categorias = Array.from(this.state.categorias);
			
			for(let i = 0; i<c.length; i++) categorias.push(c[i].nombre);
            this.setState({categorias});
        })
        
		this.consultar();
		
		
		
    }
	desactivar = (id) => {
		 let ops = {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify({id:id})
		}


        fetch('/conteo/desactivar', ops).then(r => r.text()).then((res) => {
			this.consultar();
		});


	}
    

    consultar = () => {
		
		let query = []
		
		if(this.state.usuarioSelect != 'Todos') query.push(`empleado=${this.state.usuarioSelect}`);
		if(this.state.categoriaSelect != 'Todas' && this.state.categoriaSelect != 'Parciales') query.push(`categoria=${this.state.categoriaSelect}`);
		if(this.state.categoriaSelect == 'Parciales') query.push('parcial=true');
		
		
		fetch(`/conteo/obtener?${query.join('&')}`).then((r) => r.json()).then((cats) => {
            this.setState({conteos: cats});
        })
		
		

    }

	
	
	parseConteo = (a: any) => {
		
		let horainicio = moment(a.horainicio).format("LLL");
		let horafinal = moment(a.horafinal).format("LLL");
		let tipoconteo = a.categoria == null ? 'Parcial': a.categoria;
		let enlace = `/conteo/exportar?id=${a._id}`
		let desactivar = `/conteo/desactivar?id=${a._id}`


		return (
			<tr style={{background: 'white'}}  key={a.horainicio+'ASDDD'}>
				<td>{a.nombre}</td>
				<td>{horainicio}</td>
				<td>{horafinal}</td>
				<td>{tipoconteo}</td>
				<td><a target="_blank" href={enlace}>Exportar</a></td>
				<td><a href="#" onClick={() => this.desactivar(a._id)}><Icon type="delete" /></a></td>
			</tr>
		);
	}

	usuarioCambio  = (e:any) => this.setState({usuarioSelect: e}, this.consultar);
    categoriaCambio = (e:any) => this.setState({categoriaSelect: e}, this.consultar);
   
    render() {
        return (
            <div>
				
				<Select
					style={{width: '100%'}}
					value={this.state.usuarioSelect}
					onChange={this.usuarioCambio}>{
					
					this.state.usuarios.map((usuario:any) => 
							<Option value={usuario} key={usuario}>{usuario}</Option>)
                 
				}</Select>
				
				<Select
					style={{width: '100%'}}
					value={this.state.categoriaSelect}
					onChange={this.categoriaCambio}>{
					
					this.state.categorias.map((c:any) => 
							<Option value={c} key={c}>{c}</Option>)
                 
				}</Select>
				   
                <table className="detalleApartado" style={{width: '100%'}}>
                    <thead>
                        <tr>
							<th>Capturista</th>
							<th>Inicio</th>
							<th>Fin</th>
							<th>Categoría</th>
							<th>Exportar</th>
							<th><Icon type="delete" /></th>
						</tr>
                    </thead>
                    <tbody>
						{this.state.conteos.map(this.parseConteo)}
					</tbody>
                </table>   
              
            </div>
        )
    }
}