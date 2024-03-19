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
  portada: string = ''; // Inicializar la propiedad al declararla

  constructor(
    private route: ActivatedRoute,
    private registroService: RegistroService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.nombreSerie = params['nombre'];
      this.registroService.getRegistroPorNombre(this.nombreSerie).subscribe(detalles => {
        this.detallesSerie = detalles;
      });
    });

    this.registroService.getRegistroPorNombre(this.nombreSerie).subscribe(detalles => {
      if (detalles && detalles.length > 0) {
        this.portada = detalles[0].portada; // Asigna la URL de la imagen del usuario
      }
    });
  };
}