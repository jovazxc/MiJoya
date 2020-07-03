import * as React from "react";
import { Input, Button, Modal, Upload, Icon, Select} from "antd";
import { Categorias } from ".";

interface NuevoState {
    visible: boolean;
    nombre: string;
    categorias: any;
    catSelect: string;
    confirmarDisabled: boolean;
    disableUploader: boolean;
    archivo: string;
}

const Option = Select.Option;
export class Importa extends React.Component<any, NuevoState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            nombre: '',
            categorias: [],
            catSelect: '',
            confirmarDisabled: true,
            disableUploader: false,
            archivo: ''
        }

    }

    onCancel = () => {
        this.setState({visible: false,
            nombre: '',
            categorias: [],
            catSelect: '',
            confirmarDisabled: true,
            disableUploader: false,
        archivo: ''})
    }
    onOk = () => {

        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                archivo: this.state.archivo,
                categoria: this.state.catSelect
            })
        }
        fetch('/productos/importar', ops).then((r) => r.json()).then((results) => {
            Modal.info({content: `${results.total} productos importados correctamente`});

            this.setState({
                visible: false,
                nombre: '',
                categorias: [],
                catSelect: '',
                confirmarDisabled: true,
                disableUploader: false,
                archivo: ''
            })
        })
    }

    mostrar = () => {
        this.setState({visible: true});
        fetch('/categorias/obtener').then((r) => r.json()).then((cats) => {
            this.setState({categorias: cats});
        })
    }

   nombreCambio = (e:any) => this.setState({nombre: e.target.value});
    selectCambio = (e:any) => {
        this.setState({catSelect: e, confirmarDisabled: false})
    }

    onChange = (e:any) => {
        if(e.file.status == 'done') {

            if(e.file.response.error) {
                Modal.error({content: e.file.response.error});
                return;
            }
            this.setState({disableUploader: true, archivo: e.file.response.archivo})
        }
        //console.log(e.file )
    }

    onRemove = (e:any) => {
        this.setState({disableUploader: false});
    }
    render() {
        return (
            <Modal
               visible={this.state.visible}
               onCancel={this.onCancel}
               onOk={this.onOk}
               title="Importar artículos por categoría"
               footer={[
                <Button key="back" onClick={this.onCancel}>Cancelar</Button>,
                <Button key="submit" type="primary" disabled={this.state.confirmarDisabled} onClick={this.onOk}>
                Aceptar
                </Button>,
            ]}>
    
                    <span style={{fontWeight: 'bold'}}>Categoría</span>
                    <Select style={{width: '100%'}} value={this.state.catSelect} onChange={this.selectCambio}>
                   {
                       this.state.categorias.map((categoria:any) => 
                           <Option value={categoria.nombre} key={categoria.nombre}>{categoria.nombre}</Option>
                       )
                   }
                   </Select>

                    <div  style={{height: 250}}>
                    <Upload.Dragger 
                        onChange={this.onChange}
                        onRemove={this.onRemove}
                        name="archivo"
                        action="/categorias/subirArchivo"
                        multiple={false}
                        accept=".xlsc,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        disabled={this.state.disableUploader}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Haz click para seleccionar el archivo o arrastralo aquí</p>
                        <p className="ant-upload-hint"></p>
                    </Upload.Dragger>

                    
                    </div>
            </Modal>
        )
    }
}
