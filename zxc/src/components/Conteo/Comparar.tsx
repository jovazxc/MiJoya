import * as React from "react";
import * as moment from "moment";

import {Input, Button, Select, Checkbox, Collapse, Icon, Modal, Upload} from "antd";
const Option = Select.Option;
const Panel = Collapse.Panel;

interface MainState {
    conteos: Array<any>;
	archivoCargado: boolean;
}

interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

export class Comparar extends React.Component<any, MainState> {

    constructor(props: any) {
        super(props);

        this.state = {
            conteos: new Array<any>(),
			archivoCargado: false
        };
    }

    componentDidMount () {
        
	
		
		
    }
   onChange = (e:any) => {
        if(e.file.status == 'done') {
            if(e.file.response.error) {
                Modal.error({content: e.file.response.error});
                return;
            }
			
			this.setState({archivoCargado: true, conteos: e.file.response});
        }
    }

    onRemove = (e:any) => {
		
    }
    parseConteo = (c:any) => {
		return (
			<tr key={c.codigo}>
				<td>{c.codigo}</td>
				<td>{c.cantidad}</td>
				
			</tr>
		);
	}
	
	
	mostrarUploader = () => {
		return (
		 <Upload.Dragger 
                        onChange={this.onChange}
                        onRemove={this.onRemove}
                        name="archivo"
                        action="/apartados/compararExcel"
                        multiple={false}
                        accept=".xlsc,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Haz click para seleccionar el archivo o arrastralo aquí</p>
                        <p className="ant-upload-hint"></p>
                    </Upload.Dragger>
		);
	}
	
	mostrarTabla = () => {
		return (
		<div>
		<span>Artículos con diferencias en sistema de apartado</span>
		
			<table className="detalleApartado" style={{width: '100%'}}>
				<thead>
					<tr>
						<th>SKU</th>
						<th>Cantidad Apartada</th>
					</tr>
				</thead>
				<tbody>
					{this.state.conteos.map(this.parseConteo)}
				</tbody>
			</table>   
		</div>
		);
	}
	
    render() {
        return (
            <div>
				
				{this.state.archivoCargado ? this.mostrarTabla() : this.mostrarUploader()}
					
					
                
              
            </div>
        )
    }
}