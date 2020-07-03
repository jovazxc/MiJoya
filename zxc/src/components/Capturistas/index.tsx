import * as React from "react";

import {Nuevo} from "./nuevo"
import {Modifica} from "./modifica"

export class Capturistas extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            nuevo_visible: false
        };
    }
    nuevo:any
    modifica:any

    mostrarNuevo = () => {
        this.nuevo.mostrar();
    }

    mostrarModifica = () => {
        this.modifica.mostrar();
    }



    render() {
        return (
            <div>
                <Nuevo ref={(input) => this.nuevo = input} />
                <Modifica ref={(input) => this.modifica = input} />
            </div>
        )
    }
}