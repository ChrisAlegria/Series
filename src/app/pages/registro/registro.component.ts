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
  mensaje: string = 'Selecciona la serie a modificar'; // Mensaje para mostrar en el desplegable

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
}
