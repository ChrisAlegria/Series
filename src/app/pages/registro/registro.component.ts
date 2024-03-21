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
  }

  insertarRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas registrar esta serie?');
    if (confirmacion) {
    this.agregarModificarEliminarService.createRegistro(this.registro);
    this.registro = new Registro();
    }
  };

  updateRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar esta serie?');
    if (confirmacion) {
      this.agregarModificarEliminarService.updateRegistro(this.registro);
      this.registro = new Registro();
      this.selectedSerieId = null;
      this.showUpdateButton = false; // Oculta el botón azul al presionar el botón azul
      this.mostrarBotonRojo = true; // Muestra el botón rojo al presionar el botón azul
    }
  }

  cancelarEdicion() {
    const confirmacion = confirm('¿Estás seguro de que deseas cancelar la edicion?');
    if (confirmacion) {
    this.showUpdateButton = false;
    this.mostrarBotonVerde = false; // Se oculta el botón verde al cancelar la edición
    this.mostrarBotonRojo = true;
    this.registro = new Registro();
    this.selectedSerieId = null;
    }
  }

  deleteRegistro(id: string) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta serie?');
    if (confirmacion) {
      this.agregarModificarEliminarService.deleteRegistro(id);
      this.registro = new Registro();
      this.selectedSerieId = null;
      this.showUpdateButton = false; // Oculta el botón azul al eliminar la serie
      this.mostrarBotonRojo = true; // Muestra el botón rojo al presionar el botón morado
    }
}

  selectSerie() {
    if (this.selectedSerieId) {
      this.showUpdateButton = true;
      const serieSeleccionada = this.registros.find(serie => serie.id === this.selectedSerieId);
      if (serieSeleccionada) {
        this.registro = serieSeleccionada;
      }
    } else {
      this.showUpdateButton = false;
      this.registro = new Registro();
    }
  }
} 
