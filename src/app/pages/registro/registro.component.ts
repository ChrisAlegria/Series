import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Registro } from '../../models/registro';
import { AgregarModificarEliminarService } from '../../services/agregarModificar-eliminar.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registros: Registro[] = [];
  registro = new Registro();
  generos: string[] = [];
  selectedSerie: string = '';
  showUpdateButton: boolean = false;
  selectedSerieId: string | null = null; // Propiedad para almacenar el ID del registro seleccionado
  hideDeleteButton: boolean = false;
  mostrarBotonRojo: boolean = false;
  mostrarBotonVerde: boolean = false;
  mensaje: string = 'Selecciona un genero para la serie'; // Mensaje para mostrar en el desplegable
  opcionSeleccionada: boolean = false; // Variable para controlar si se ha seleccionado una opción
  selectedOptions: string[] = []; // Mantenemos un registro de las opciones seleccionadas
  generoSeleccionado: boolean = false; // Variable para controlar si se ha seleccionado un género

  

  constructor(private registroService: RegistroService, private agregarModificarEliminarService: AgregarModificarEliminarService) {}

  ngOnInit(): void {
    this.registroService.getRegistros().subscribe(data => {
      this.registros = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Registro,
          id: doc.payload.doc.id
        };
      });
    });    
    this.registroService.getGeneros().subscribe(generos => {
      this.generos = generos;
    });
    // Mostrar el mensaje la primera vez
    this.selectedSerieId = "message";
  }

  insertarRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas registrar esta serie?');
    if (confirmacion) {
      // Agregar los géneros seleccionados al registro antes de insertarlo
      this.registro.genero = this.selectedOptions;

      this.agregarModificarEliminarService.createRegistro(this.registro);
      this.registro = new Registro();
      // Mostrar el mensaje después de insertar el registro
      this.selectedSerieId = "message";
    }
  };

  updateRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar esta serie?');
    if (confirmacion) {
      // Agregar los géneros seleccionados al registro antes de actualizarlo
      this.registro.genero = this.selectedOptions;

      this.agregarModificarEliminarService.updateRegistro(this.registro);
      this.registro = new Registro();
      this.selectedSerieId = null;
      this.showUpdateButton = false;
      this.mostrarBotonRojo = true;
      // Mostrar el mensaje después de actualizar el registro
      this.selectedSerieId = "message";
    }
  }

  cancelarEdicion() {
    const confirmacion = confirm('¿Estás seguro de que deseas cancelar la edicion?');
    if (confirmacion) {
      this.showUpdateButton = false;
      this.mostrarBotonVerde = false;
      this.mostrarBotonRojo = true;
      this.registro = new Registro();
      this.selectedSerieId = null;
      // Mostrar el mensaje después de cancelar la edición
      this.selectedSerieId = "message";
    }
  }

  deleteRegistro(id: string) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta serie?');
    if (confirmacion) {
      this.agregarModificarEliminarService.deleteRegistro(id);
      this.registro = new Registro();
      this.selectedSerieId = null;
      this.showUpdateButton = false;
      this.mostrarBotonRojo = true;
      // Mostrar el mensaje después de eliminar el registro
      this.selectedSerieId = "message";
    }
  }

  selectSerie() {
    if (this.selectedSerieId !== "message") {
      this.showUpdateButton = true;
      const serieSeleccionada = this.registros.find(serie => serie.id === this.selectedSerieId);
      if (serieSeleccionada) {
        // Obtener el género de la serie seleccionada
        const generoSeleccionado = serieSeleccionada.genero;
        // Actualizar el mensaje con el género seleccionado
        this.mensaje = `${generoSeleccionado}`;
        this.registro = serieSeleccionada;
      }
      this.mostrarBotonRojo = false;
      this.mostrarBotonVerde = false;
    } else {
      this.showUpdateButton = false;
      this.registro = new Registro();
      this.mostrarBotonRojo = true;
    }
  }

  updateSelectedGenre(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex].text;
  
    // Reinicia el valor del select
    selectElement.value = 'null';
  
    // Si la opción seleccionada ya está en la lista de opciones seleccionadas, quítala
    const index = this.selectedOptions.indexOf(selectedOption);
    if (index !== -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      // Agrega la opción seleccionada al registro de opciones seleccionadas si no estaba presente
      this.selectedOptions.push(selectedOption);
    }
  
    // Actualiza el mensaje con todas las opciones seleccionadas
    this.updateMessage();
  
    // Iterar sobre todas las opciones y cambiar su color según estén seleccionadas o no
    Array.from(selectElement.options).forEach(option => {
      const optionText = option.text;
      if (this.selectedOptions.includes(optionText)) {
        option.style.color = 'red'; // Está seleccionada, por lo que cambia el color a rojo
      } else {
        option.style.color = 'black'; // No está seleccionada, por lo que cambia el color a negro
      }
    });
  }
  

  updateMessage(): void {
    // Construye el mensaje con todas las opciones seleccionadas
    this.mensaje = '';
    for (let i = 0; i < this.selectedOptions.length; i++) {
      if (i !== 0) {
        this.mensaje += ', '; // Agrega una coma entre las opciones
      }
      this.mensaje += this.selectedOptions[i]; // Agrega la opción al mensaje
    }
  }

  resetMessageAndSelect(): void {
    this.mensaje = 'Selecciona un género para la serie';
    this.selectedSerieId = "message";
    // Obtener el elemento select y reiniciar su valor
    const selectElement = document.getElementById('tuSelectId') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = 'null';
    }
  }
}
