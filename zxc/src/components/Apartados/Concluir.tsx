import * as React from "react";
import { Input, Modal, Button, Card, Select} from "antd";

interface NuevoState {
    visible: boolean;
    apartados: Array<any>;
	apartadoSelect: string;

}
interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

const Option = Select.Option;

export class Concluir extends React.Component<any, NuevoState> {
    constructor(props: any) {
        super(props);
        this.state = {
           visible: false,
            apartados: new Array<any>(),
			apartadoSelect: ''

        }

    }
	
	componentDidMount() {
		
	}

    onCancel = () => {
        this.setState({
            visible: false,
            apartados: new Array<any>(),
			apartadoSelect: ''
          
        })
    }
    onOk = () => {

        if(this.state.apartadoSelect == '') {
            Modal.error({content: 'Debes seleccionar un apartado'})
            return;
        }


        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                nombre: this.state.apartadoSelect
			})
        }
		
		fetch('/apartados/concluir', ops).then((r) => r.text()).then((a) => {
			Modal.info({title: 'Apartados', content: 'El apartado ha sido concluido correctamente'});
			this.setState({
				visible: false,
				apartados: new Array<any>(),
				apartadoSelect: ''
			});
		});
		
		

    
    }

    mostrar = () => {
		fetch('/apartados/obtener').then((r) => r.json()).then((c) => {
			let apartados = [];
			
			for(let i = 0; i<c.length; i++) apartados.push(c[i].nombre);
            this.setState({apartados, visible: true});
        })
		
      
      
    }

    apartadoCambio = (e:any) => this.setState({apartadoSelect: e});

    render() {
        return (
            <Modal
                visible={this.state.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
                title="Concluir apartado">
				
				
				<Select
					style={{width: '100%'}}
					value={this.state.apartadoSelect}
					onChange={this.apartadoCambio}>{
					
					this.state.apartados.map((ap:any) => 
							<Option value={ap} key={ap}>{ap}</Option>)
                 
				}</Select>


            </Modal>
        )
    }
}
