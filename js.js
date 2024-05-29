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
      const cuotaInteres = this.monto * tasaInteres / 100;
      const totalPrestamo = this.monto + cuotaInteres * this.plazo;
      const cuotaMensual = totalPrestamo / this.plazo;
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
    const amortizacionTable = document.getElementById('amortization-table').getElementsByTagName('tbody')[0];
    amortizacionTable.innerHTML = '';
  }

  // Función para calcular el amortización francés
  function calcularAmortizacion(prestamo) {
    const cuotaMensual = parseFloat(prestamo.calcularCuota());
    const tasaInteres = prestamo.cliente.tasaInteres / 100;
    const saldoInicial = prestamo.monto;
    let saldoPendiente = saldoInicial;
    const amortizacionTable = document.getElementById('amortization-table').getElementsByTagName('tbody')[0];

    for (let i = 1; i <= prestamo.plazo; i++) {
      const interes = saldoPendiente * tasaInteres;
      let capitalAmortizado = cuotaMensual - interes;

      // Ajustar capital amortizado si hace que el saldo pendiente sea negativo
      if (saldoPendiente - capitalAmortizado < 0) {
        capitalAmortizado = saldoPendiente;
      }

      saldoPendiente -= capitalAmortizado;

      const newRow = amortizacionTable.insertRow();
      newRow.innerHTML = `
        <td>${i}</td>
        <td>$${cuotaMensual.toFixed(2)}</td>
        <td>$${capitalAmortizado.toFixed(2)}</td>
        <td>$${interes.toFixed(2)}</td>
      `;

      // Salir del bucle si el saldo pendiente es cero o es la última cuota
      if (saldoPendiente <= 0) {
        break;
      }
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

    const amount = parseFloat(document.getElementById('amount').value);
    const months = parseInt(document.getElementById('months').value);
    const clientType = document.getElementById('client-type').value;

    let cliente;
    switch (clientType) {
      case 'normal':
        cliente = new Cliente('Normal', 5); // Tasa de interés del 5%
        break;
      case 'premium':
        cliente = new Cliente('Premium', 3); // Tasa de interés del 3%
        break;
      case 'vip':
        cliente = new Cliente('VIP', 1); // Tasa de interés del 1%
        break;
      default:
        cliente = new Cliente('Normal', 5);
    }

    const prestamo = new Prestamo(amount, months, cliente);
    const cuotaMensual = prestamo.calcularCuota();

    mostrarMensaje(`La cuota mensual es de $${cuotaMensual}`, 'success');

    // Calcular y mostrar la tabla de amortización
    calcularAmortizacion(prestamo);
  });