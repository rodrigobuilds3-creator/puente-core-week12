export function DefenseDeck() {
  return (
    <section className="defense-deck" aria-labelledby="defense-title">
      <header>
        <p className="sponsor-kicker">PUENTE · DEFENSA DEL PRODUCTO</p>
        <h1 id="defense-title">Antes del primer pago</h1>
      </header>
      <ol className="defense-slides" role="list">
        <li>
          <article>
            <h2>Necesidad</h2>
            <p>Una persona que vive de ingresos por día necesita cubrir sus gastos entre el inicio de un trabajo y el primer cobro.</p>
          </article>
        </li>
        <li>
          <article>
            <h2>Producto</h2>
            <p>La calculadora estima el margen de 14 días. Si falta confirmar la oportunidad, muestra qué preguntar y cómo conservar el ingreso actual antes de ver el desglose.</p>
            <a href="/#calculadora">Probar con cifras ficticias</a>
          </article>
        </li>
        <li>
          <article>
            <h2>Usuarios</h2>
            <p>Personas con ingresos informales que evalúan un trabajo desde el celular. Una organización puede facilitar el uso sin recibir registros individuales ni influir en el resultado.</p>
          </article>
        </li>
        <li>
          <article>
            <h2>Precio</h2>
            <p>Acceso gratuito para la persona. La propuesta grupal para 20 personas toma $2,800 MXN antes de impuestos como referencia. Falta la aprobación de quien controla el presupuesto.</p>
            <a href="/pricing">Revisar el modelo de costos</a>
          </article>
        </li>
        <li>
          <article>
            <h2>Siguiente paso</h2>
            <p>Observar a tres personas usando el ejemplo en su celular sin pistas. Registrar qué harían primero y preguntar si conservarían su turno mientras confirman el pago.</p>
            <a href="#memo">Ver el memo de costos y evidencia</a>
          </article>
        </li>
      </ol>
    </section>
  );
}
