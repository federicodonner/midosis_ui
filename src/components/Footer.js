import React from "react";
import Header from "./Header";
import { leerDesdeLS, guardarEnLS } from "../fetchFunctions";
import variables from "../var/variables.js";

import * as Fitty from "fitty/dist/fitty.min";

class Footer extends React.Component {
  state = { pastilleroSeleccionado: null, pastilleros: null };

  // Invierte el flag de agrandado para que aparezcan
  // el resto de las opciones
  toggleTamaño = (toggle) => (event) => {
    event.preventDefault();
    this.setState({ agrandado: toggle });
  };

  navegarANuevoPastillero = () => (event) => {
    this.props.navegarANuevoPastillero();
  };

  // Función ejecutada cuando se selecciona un pastillero nuevo
  // Actualiza el id en LS y ejecuta la función de home que lo actualiza en state
  seleccionPastillero = (event) => {
    var pastilleroSeleccionado = event.target.value;
    guardarEnLS(
      variables.LSPastilleroPorDefecto,
      JSON.stringify(pastilleroSeleccionado)
    );
    // reinicia la seleccción del combo
    event.target.value = 0;
    // Procesa el state para actualizar el nombre del usuario y el combo
    this.procesarPastilleros(pastilleroSeleccionado);
  };

  procesarPastilleros = () => {
    // Verifica que ya haya un pastillero por defecto ya guardado
    var pastilleroActual = JSON.parse(
      leerDesdeLS(variables.LSPastilleroPorDefecto)
    );
    if (!pastilleroActual) {
      // Si no hay un pastillero actual
      // guarda el primer pastillero como pastillero por defecto
      // el LS y en el state
      pastilleroActual = this.props.pastilleros[0].id;
      guardarEnLS(
        variables.LSPastilleroPorDefecto,
        JSON.stringify(pastilleroActual)
      );
    }
    var pastilleroSeleccionado = {};
    var otrosPastilleros = [];
    // Recorre los pastilleros buscando al seleccionado
    // Necesita eliminarlo de la lista de opciones y obtener el nombre del dueño
    this.props.pastilleros.forEach((pastillero) => {
      if (pastillero.id == pastilleroActual) {
        pastilleroSeleccionado.nombreCompleto =
          pastillero.paciente_nombre + " " + pastillero.paciente_apellido;
      } else {
        // Si no es el seleccionado lo guarda en un array para el state
        otrosPastilleros.push(pastillero);
      }
    });
    // Guarda los datos en el state y cierra el modal por si está abierto
    this.setState(
      {
        pastilleroSeleccionado: pastilleroSeleccionado,
        pastilleros: otrosPastilleros,
        agrandado: false,
      },
      () => {
        Fitty(".fit", { maxSize: 22 });
      }
    );
  };

  componentDidMount() {
    // Procesa los pastilleros recibidos para mostrar el seleccionado
    // y la lista de otros posibles para cambiar
    this.procesarPastilleros(this.props.pastilleroActual);
  }

  render() {
    return (
      <div className={this.state.agrandado ? "footer agrandado" : "footer"}>
        <div className="titulo-footer">
          {this.state.pastilleroSeleccionado && (
            <span className="fit" onClick={this.toggleTamaño(true)}>
              Pastillero de{" "}
              <span className="negrita">
                {this.state.pastilleroSeleccionado.nombreCompleto}
              </span>
            </span>
          )}
          {!this.state.pastilleroSeleccionado && (
            <span className="fit" onClick={this.toggleTamaño(true)}>
              Sin pastillero. <span className="negrita">Selecciona uno</span>.
            </span>
          )}
        </div>
        <div className="modal-seleccion-pastillero">
          {this.state.pastilleros && this.state.pastilleros.length > 0 && (
            <div>
              <p>Selecciona otro pastillero:</p>
              <select
                defaultValue="0"
                className="seleccion-pastillero"
                onChange={this.seleccionPastillero}
              >
                <option disabled value="0">
                  {" "}
                  -- Tus pastilleros --{" "}
                </option>
                {this.state.pastilleros.map((pastillero) => {
                  return (
                    <option value={pastillero.id} key={pastillero.id}>
                      {pastillero.paciente_nombre +
                        " " +
                        pastillero.paciente_apellido}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {this.state.pastilleros && this.state.pastilleros.length < 1 && (
            <div className="texto-sin-pastilleros-footer">
              <p>
                No tiene otros pastilleros, presiona{" "}
                <span
                  className="negrita"
                  onClick={this.navegarANuevoPastillero()}
                >
                  aquí
                </span>{" "}
                para crear uno nuevo.
              </p>
            </div>
          )}
          <span className="negrita" onClick={this.toggleTamaño(false)}>
            Cerrar
          </span>
        </div>
      </div>
    );
  }
}

export default Footer;
