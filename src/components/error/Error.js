import React from "react";
import "./error.css";

export default function Error(props) {
  function navegarAHome() {
    props.history.push({
      pathname: "home",
    });
  }

  return (
    <div className="app-view cover">
      <div className="scrollable">
        <div className="content">
          <div className="imagen-error" />
          <p>
            Algo funcionó mal, te pedimos disculpas. Presiona{" "}
            <span className="negrita" onClick={navegarAHome}>
              aquí
            </span>{" "}
            para volver.
          </p>
        </div>
      </div>
    </div>
  );
}
