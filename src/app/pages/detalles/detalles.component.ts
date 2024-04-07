import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Registro } from '../../models/registro';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {
  nombreSerie: string = '';
  detallesSerie: Registro[] = [];
  backdrop: string = '';
  minHeight: number = 0;

  constructor(
    private route: ActivatedRoute,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.nombreSerie = params['nombre'];
      this.registroService.getRegistroPorNombre(this.nombreSerie).subscribe(detalles => {
        this.detallesSerie = detalles;
        if (detalles && detalles.length > 0) {
          const nombreSerie = detalles[0].nombre;
          const anio = detalles[0].anio;
          this.registroService.getBackdrops(nombreSerie, anio).subscribe((response: any) => {
            if (response && response.results && response.results.length > 0) {
              this.backdrop = `https://image.tmdb.org/t/p/original${response.results[0].backdrop_path}`;
            }
          });
        }
      });
    });

    // Calcular la altura mínima basada en la altura actual de la ventana
    this.minHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Actualizar la altura mínima cuando cambia el tamaño de la ventana
    this.minHeight = window.innerHeight;
    this.ajustarAlturaSegunContenido();
  }

  private ajustarAlturaSegunContenido(): void {
    const coverSection = document.querySelector('.cover-section') as HTMLElement;
    if (coverSection) {
      const contentHeight = coverSection.scrollHeight;
      if (contentHeight > this.minHeight) {
        coverSection.style.height = `${contentHeight}px`;
      } else {
        coverSection.style.height = `${this.minHeight}px`;
      }
    }
  }
}
