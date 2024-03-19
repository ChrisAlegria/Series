import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Registro } from '../../models/registro';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {
  nombreSerie: string = ''; // Valor predeterminado
  detallesSerie: Registro[] = []; // Declarar detallesSerie y asignarle un array vacío
  backdrop: string = ''; // Inicializar la propiedad al declararla

  constructor(
    private route: ActivatedRoute,
    private registroService: RegistroService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.nombreSerie = params['nombre'];
      // Llama al servicio para obtener detalles de la serie
      this.registroService.getRegistroPorNombre(this.nombreSerie).subscribe(detalles => {
        this.detallesSerie = detalles;
        if (detalles && detalles.length > 0) {
          // Obtiene el nombre de la serie
          const nombreSerie = detalles[0].nombre;
          // Llama al servicio para obtener la imagen de la serie
          this.registroService.getImagenSerie(nombreSerie).subscribe((response: any) => {
            if (response && response.results && response.results.length > 0) {
              // Obtiene la URL de la imagen de la serie
              this.backdrop = `https://image.tmdb.org/t/p/original${response.results[0].backdrop_path}`;
            }
          });
        }
      });
    });
  }
}
