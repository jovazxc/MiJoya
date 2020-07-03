import * as React from "react";
import { Input, Button, Modal, Select } from "antd";

const Option = Select.Option

interface ModificaState {
    visible: boolean;
    nombre: string;
    nombreDisabled: boolean;
    categorias: any;
    loading: boolean;
    confirmarDisabled: boolean;
    catSelect: string;
}
export class Modifica extends React.Component<any, ModificaState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            nombre: '',
            nombreDisabled: true,
            categorias: [],
            loading: true,
            confirmarDisabled: true,
            catSelect: ''
        }

    }

    onCancel = () => {
        this.setState({
            visible: false,
            nombre: '',
            nombreDisabled: true,
            categorias: [],
            loading: true,
            confirmarDisabled: true,
            catSelect: ''
        })
    }
    onOk = () => {

        if(this.state.nombre == '') {
            Modal.error({content: 'El nombre de la categoría no puede estar vacío'})
            return;
        }

        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                nombre: this.state.catSelect,
                nuevoNombre: this.state.nombre
            })
        }
        fetch('/categorias/modificar', ops).then((r) => r.text()).then((results) => {
            Modal.info({content: 'Categoría modificada correctamente'});

            this.setState({
                visible: false,
                nombre: '',
                catSelect: '',
                confirmarDisabled: true
            });
        })
    }

    mostrar = () => {

        this.setState({visible: true, loading: true, confirmarDisabled: true});
        fetch('/categorias/obtener').then((r) => r.json()).then((cats) => {
            this.setState({categorias: cats, loading: false, nombreDisabled: false});
        })
        
    } 


    nombreCambio = (e:any) => this.setState({nombre: e.target.value});

    selectCambio = (e:any) => {
        this.setState({confirmarDisabled: false, catSelect: e})
    }
   
    render() {
        return (
            <Modal
               visible={this.state.visible}
               onCancel={this.onCancel}
               onOk={this.onOk}
               title="Modificar categoria"
               footer={[
                    <Button key="back" onClick={this.onCancel}>Cancelar</Button>,
                    <Button key="submit" type="primary" disabled={this.state.confirmarDisabled} onClick={this.onOk}>
                    Aceptar
                    </Button>,
                ]}>

                   <span style={{fontWeight: 'bold'}}>Categoría</span>
                   <Select style={{width: '100%'}} loading={this.state.loading} value={this.state.catSelect} onChange={this.selectCambio}>
                   {
                       this.state.categorias.map((categoria:any) => 
                           <Option value={categoria.nombre} key={categoria.nombre}>{categoria.nombre}</Option>
                       )
                   }
                   </Select>

                   <span style={{fontWeight: 'bold'}}>Nuevo nombre</span>
                   <Input onChange={this.nombreCambio} value={this.state.nombre} disabled={this.state.nombreDisabled} />
            </Modal>
        )
    }
}
