class Cliente {
    constructor(nombre, tasaInteres) {
      this.nombre = nombre;
      this.tasaInteres = tasaInteres;
    }
  }

  class Prestamo {
    constructor(monto, plazo, cliente) {
      this.monto = monto;
      this.plazo = plazo;
      this.cliente = cliente;
    }

    calcularCuota() {
      const tasaInteres = this.cliente.tasaInteres;
      const tasaInteresmensual = tasaInteres / 1200;
      const plazonegativo = this.plazo * (-1)
      const cuotaInteres = this.monto * tasaInteresmensual;
      const IVA = 0.21 * cuotaInteres;
      const cuotainicial = this.monto * ((tasaInteresmensual)/(1-Math.pow((1+tasaInteresmensual),plazonegativo)));
      const cuotaMensual = IVA + cuotainicial;
      return cuotaMensual.toFixed(2);
    }
  }

  // Función para mostrar SweetAlert
  function mostrarMensaje(mensaje, tipo) {
    swal({
      title: mensaje,
      icon: tipo,
    });
  }

  // Función para limpiar la tabla
  function limpiarTabla() {
    const amortizacionTable = document.getElementById('tabla_de_amortizacion').getElementsByTagName('tbody')[0];
    amortizacionTable.innerHTML = '';
  }

  // Función para calcular el amortización francés
  function calcularAmortizacion(prestamo) {
    const cuotaMensual = parseFloat(prestamo.calcularCuota());
    const tasaInteresmensual = prestamo.cliente.tasaInteres / 1200;
    const cuotaInteres = prestamo.monto * tasaInteresmensual;
    const IVA = 0.21 * cuotaInteres;
    const saldoInicial = prestamo.monto;
    let saldoPendiente = saldoInicial;

    const amortizacionTable = document.getElementById('tabla_de_amortizacion').getElementsByTagName('tbody')[0];

    for (let i = 1; i <= prestamo.plazo; i++) {
      const interes = saldoPendiente * tasaInteresmensual;
      let capitalAmortizado = cuotaMensual - IVA - interes;

      saldoPendiente -= capitalAmortizado;

      const newRow = amortizacionTable.insertRow();
      newRow.innerHTML = `
        <td>${i}</td>
        <td>$${cuotaMensual.toFixed(2)}</td>
        <td>$${capitalAmortizado.toFixed(2)}</td>
        <td>$${interes.toFixed(2)}</td>
      `;
    }

    // Almacenar en localStorage
    let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
    prestamos.push(prestamo);
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
  }

  // Manejador de evento para el formulario
  document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpiar la tabla antes de agregar nuevas filas
    limpiarTabla();

    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const meses = parseInt(document.getElementById('meses').value);
    const clientType = document.getElementById('tipo_de_cliente').value;

    let cliente;
    switch (clientType) {
      case 'Simple':
        cliente = new Cliente('Simple', 120); // Tasa de interés del 120%
        break;
      case 'Insignia':
        cliente = new Cliente('Insignia', 100); // Tasa de interés del 100%
        break;
      case 'Premium':
        cliente = new Cliente('Premium', 60); // Tasa de interés del 60%
        break;
      default:
        cliente = new Cliente('Simple', 120);
    }

    const prestamo = new Prestamo(cantidad, meses, cliente);
    const cuotaMensual = prestamo.calcularCuota();

    mostrarMensaje(`La cuota mensual es de $${cuotaMensual}`, 'success');

    // Calcular y mostrar la tabla de amortización
    calcularAmortizacion(prestamo);
  });