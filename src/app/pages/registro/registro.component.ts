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
      this.agregarModificarEliminarService.createRegistro(this.registro);
      this.registro = new Registro();
      // Mostrar el mensaje después de insertar el registro
      this.selectedSerieId = "message";
    }
  };

  updateRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar esta serie?');
    if (confirmacion) {
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
  
    // Deshabilita la opción seleccionada para que no pueda ser seleccionada de nuevo
    const selectedIndex = selectElement.selectedIndex;
    if (selectedIndex !== -1) {
      selectElement.options[selectedIndex].disabled = true;
    }
  
    // Reinicia el valor del select
    selectElement.value = 'null';
  
    // Establece la variable opcionSeleccionada como true
    this.opcionSeleccionada = true;
  
    // Establece generoSeleccionado como true
    this.generoSeleccionado = true;
  
    // Agrega la opción seleccionada al registro de opciones seleccionadas
    this.selectedOptions.push(selectedOption);
  
    // Actualiza el mensaje con todas las opciones seleccionadas
    this.updateMessage();
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
