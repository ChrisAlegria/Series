import { Component, OnInit } from '@angular/core';
import { Registro } from '../../models/registro';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css']
})
export class VisualizarComponent implements OnInit {
  registros: Registro[] = [];

  constructor(private registroService: RegistroService) {}

  ngOnInit(): void {
    this.registroService.getRegistros().subscribe(data => {
      this.registros = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Registro,
          id: doc.payload.doc.id
        };
      });

      // Obtener imágenes de series de televisión para cada registro
      this.registros.forEach(registro => {
        this.registroService.getPoster(registro.nombre, registro.anio).subscribe((response: any) => {
          if (response && response.results && response.results.length > 0) {
            registro.imagenSerie = `https://image.tmdb.org/t/p/original${response.results[0].poster_path}`;
          }
        });
      });
    });
  }
}
