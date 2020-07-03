import * as React from "react";

import {Nuevo} from "./nuevo"
import {Modifica} from "./modifica"
import {Importa} from "./importa"

export class Categorias extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            nuevo_visible: false
        };
    }
    nuevo:any
    modifica:any
    importa:any
    
    mostrarNuevo = () => {
        this.nuevo.mostrar();
    }

    mostrarModifica = () => {
        this.modifica.mostrar();
    }

    mostrarImporta = () => {
        this.importa.mostrar();
    }



    render() {
        return (
            <div>
                <Nuevo ref={(input) => this.nuevo = input} />
                <Modifica ref={(input) => this.modifica = input} />
                <Importa ref={(input) => this.importa = input} />
            </div>
        )
    }
}