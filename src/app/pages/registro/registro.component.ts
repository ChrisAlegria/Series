import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Registro } from '../../models/registro';
import { AgregarModificarEliminarService } from '../../services/agregarModificar-eliminar.service';
import { Genero } from '../../models/generos';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registros: Registro[] = [];
  registro = new Registro();
  genero = new Genero();
  generos: string[] = [];
  selectedSerie: string = '';
  showUpdateButton: boolean = false;
  selectedSerieId: string | null = null; // Propiedad para almacenar el ID del registro seleccionado
  hideDeleteButton: boolean = false;
  mostrarBotonRojo: boolean = false;
  mostrarBotonVerde: boolean = false;
  generoActual: string = '';
  mensaje: string = 'Selecciona un genero para la serie'; // Mensaje para mostrar en el desplegable
  opcionSeleccionada: boolean = false; // Variable para controlar si se ha seleccionado una opción
  selectedOptions: string[] = []; // Mantenemos un registro de las opciones seleccionadas
  generoSeleccionado: boolean = false; // Variable para controlar si se ha seleccionado un género
  nombreCambiado: boolean = false;
  descripcionCambiada: boolean = false;
  anioCambiado: boolean = false;
  generoCambiado: boolean = false;
  calificacionCambiada: boolean = false;
  selectedStars: number = 0;
  ratingValues: { [key: number]: number } = {
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50,
    6: 60,
    7: 70,
    8: 80,
    9: 90,
    10: 100,
  };
  

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
  
      // Establecer el valor de la calificación utilizando el objeto ratingValues
      this.registro.porcentajeCalificacion = this.ratingValues[this.selectedStars];
  
      // Llamar al servicio para crear el registro
      this.agregarModificarEliminarService.createRegistro(this.registro);
      
      // Reiniciar el registro
      this.registro = new Registro();
  
      // Mostrar el mensaje después de insertar el registro
      this.selectedSerieId = "message";
    }
  }

  updateRegistro() {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar esta serie?');
    if (confirmacion) {
      // Agregar los géneros seleccionados al registro antes de actualizarlo
      this.registro.genero = this.selectedOptions;
  
      // Verificar si hay estrellas seleccionadas
      if (this.selectedStars === 0) {
        alert('Debes seleccionar al menos una estrella antes de actualizar la serie.');
        return; // Salir de la función si no hay estrellas seleccionadas
      }
  
      // Llamar al servicio para actualizar el registro
      this.agregarModificarEliminarService.updateRegistro(this.registro);
  
      // Reiniciar el registro
      this.registro = new Registro();
  
      // Reiniciar el ID seleccionado
      this.selectedSerieId = null;
  
      // Reiniciar las variables de control de botones
      this.showUpdateButton = false;
      this.mostrarBotonVerde = false;
      this.mostrarBotonRojo = true;
  
      // Reiniciar el mensaje y las opciones seleccionadas
      this.resetMessageAndSelect();
      this.resetStars();
  
      // Reiniciar el color de las opciones del desplegable a negro
      const selectElement = document.getElementById('tuSelectId') as HTMLSelectElement;
      if (selectElement) {
        Array.from(selectElement.options).forEach(option => {
          option.style.color = 'black';
        });
      }
    }
  }
  

  cancelarEdicion() {
    const confirmacion = confirm('¿Estás seguro de que deseas cancelar la edición?');
    if (confirmacion) {

      // Reiniciar el registro
      this.registro = new Registro();
      // Reiniciar el ID seleccionado
      this.selectedSerieId = null;
      // Reiniciar las variables de control de botones
      this.showUpdateButton = false;
      this.mostrarBotonVerde = false;
      this.mostrarBotonRojo = true;
  
      // Reiniciar el mensaje y las opciones seleccionadas
      this.resetMessageAndSelect();
      this.resetStars();

      // Reiniciar el color de las opciones del desplegable a negro
      const selectElement = document.getElementById('tuSelectId') as HTMLSelectElement;
      if (selectElement) {
        Array.from(selectElement.options).forEach(option => {
          option.style.color = 'black';
        });
      }
    }
  }
  
  
  deleteRegistro(id: string) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta serie?');
    if (confirmacion) {
      // Llamar al servicio para eliminar el registro
      this.agregarModificarEliminarService.deleteRegistro(id);
  
      // Reiniciar el registro
      this.registro = new Registro();
  
      // Reiniciar el ID seleccionado
      this.selectedSerieId = null;
  
      // Reiniciar las variables de control de botones
      this.showUpdateButton = false;
      this.mostrarBotonVerde = false;
      this.mostrarBotonRojo = true;
  
      // Reiniciar el mensaje y las opciones seleccionadas
      this.resetMessageAndSelect();
      this.resetStars();
  
      // Reiniciar el color de las opciones del desplegable a negro
      const selectElement = document.getElementById('tuSelectId') as HTMLSelectElement;
      if (selectElement) {
        Array.from(selectElement.options).forEach(option => {
          option.style.color = 'black';
        });
      }
    }
  }

  selectSerie() {
    if (this.selectedSerieId !== "message") {
      this.showUpdateButton = true;
      const serieSeleccionada = this.registros.find(serie => serie.id === this.selectedSerieId);
      if (serieSeleccionada) {
        // Obtener el género o los géneros de la serie seleccionada
        const generosSeleccionados = serieSeleccionada.genero;
        if (Array.isArray(generosSeleccionados)) {
          // Si hay más de un género, actualiza el mensaje con los géneros seleccionados
          this.mensaje = generosSeleccionados.join(', ');
        } else {
          // Si hay solo un género, actualiza el mensaje con ese género
          this.mensaje = generosSeleccionados;
        }
        this.registro = serieSeleccionada;
  
        // Actualizar automáticamente los géneros seleccionados
        this.selectedOptions = Array.isArray(generosSeleccionados) ? generosSeleccionados : [generosSeleccionados];
  
        // Actualizar el mensaje con todas las opciones seleccionadas
        this.updateMessage();
  
        // Reiniciar las estrellas seleccionadas
        this.resetStars();
  
        // Verificar el valor de la calificación para colorear las estrellas
        if (serieSeleccionada.porcentajeCalificacion) {
          const starsSelected = serieSeleccionada.porcentajeCalificacion / 10;
          this.setSelectedStars(starsSelected);
        }
  
        // Reiniciar las variables de control de cambios
        this.nombreCambiado = false;
        this.descripcionCambiada = false;
        this.anioCambiado = false;
        this.calificacionCambiada = false;
        this.generoCambiado = false;
      }
      this.mostrarBotonRojo = false;
    } else {
      this.showUpdateButton = false;
      this.registro = new Registro();
      this.mostrarBotonRojo = true;
      this.mostrarBotonVerde = false; // Desactivar el botón azul al seleccionar un mensaje de "Modificar una serie"
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
  
    // Verifica si hay al menos una opción seleccionada
    this.generoSeleccionado = this.selectedOptions.length > 0;
  
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
  
    // Luego de actualizar las opciones seleccionadas, verifica si el botón debe habilitarse
    this.checkButtonStatus();
  }
  

  checkButtonStatus() {
    // Habilitar el botón si todos los campos obligatorios están llenos y al menos un género está seleccionado
    this.mostrarBotonRojo = !(!this.registro.nombre || !this.registro.descripcion || !this.registro.anio || !this.generoSeleccionado || !this.selectedStars);
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

  resetMessageAndSelect(confirmDelete: boolean = false): void {
    if (!confirmDelete) {
      // Restablecer solo el selectedSerieId sin cambiar el mensaje
      this.selectedSerieId = "message";
      
      // Limpiar las opciones seleccionadas
      this.selectedOptions = [];
  
      // Reiniciar el mensaje
      this.mensaje = 'Selecciona un genero para la serie';
  
      // Reiniciar el color de las opciones del desplegable a negro
      const selectElement = document.getElementById('tuSelectId') as HTMLSelectElement;
      if (selectElement) {
        Array.from(selectElement.options).forEach(option => {
          option.style.color = 'black';
        });
      }
    }
  }
  

  // Métodos para rastrear los cambios en cada campo del formulario
  onNombreChange(): void {
    this.nombreCambiado = true;
  }

  onDescripcionChange(): void {
    this.descripcionCambiada = true;
  }

  onAnioChange(): void {
    this.anioCambiado = true;
  }

  onGeneroChange(): void {
    this.generoCambiado = true;
  }

  onCalificacionChange(): void {
    this.calificacionCambiada = true;
    this.calificacionCambiada = true;
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedOptions.includes(genre);
  }
  

  highlightStars(star: number): void {
    if (!this.selectedStars) {
      this.selectedStars = star;
    }
  }
  
  resetStars(): void {
    this.selectedStars = 0;
  }
  
  setSelectedStars(star: number): void {
    if (this.selectedStars === star) {
      this.selectedStars = 0;
      this.registro.porcentajeCalificacion = 0;
    } else {
      this.selectedStars = star;
      this.registro.porcentajeCalificacion = this.calculateRatingValue(star);
      this.calificacionCambiada = true; // Establecer calificacionCambiada en true cuando se selecciona una estrella
    }
    this.checkButtonStatus(); // Verificar el estado del botón después de seleccionar una estrella
  }

  calculateRatingValue(star: number): number {
    const ratingValues: { [key: number]: number } = {
      1: 10,
      2: 20,
      3: 30,
      4: 40,
      5: 50,
      6: 60,
      7: 70,
      8: 80,
      9: 90,
      10: 100,
    };
    return ratingValues[star];
  }

  onStarClick(starNumber: number) {
    // Establecer el número de estrellas seleccionadas
    this.selectedStars = starNumber;
    
    // Verificar si hay al menos una estrella seleccionada para habilitar el botón rojo
    this.checkButtonStatus();
  }

  // Función para agregar un género a Firebase
  agregarGenero() {
    const nuevoGenero = prompt('Ingresa el nombre del nuevo género:');
    if (nuevoGenero) {
      this.agregarModificarEliminarService.guardarGeneroEnFirebase(nuevoGenero);
    }
  }

  eliminarGenero(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const generoSeleccionado = selectElement.value;
    
    if (generoSeleccionado) {
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el género "${generoSeleccionado}"?`);
      if (confirmacion) {
        // Eliminar el género del arreglo local
        const index = this.generos.indexOf(generoSeleccionado);
        if (index !== -1) {
          this.generos.splice(index, 1);
        }
        
        // Llamar al servicio para eliminar el género de la base de datos
        this.agregarModificarEliminarService.eliminarGenero(generoSeleccionado);
      }
    }
  }
}