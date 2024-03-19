import { Component, OnInit } from '@angular/core';
import { Registro } from '../../models/registro';
import { RegistroService } from '../../services/registro.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registros: Registro[] = [];
  registro = new Registro();
  generos: string[] = [];

  constructor(private registroService: RegistroService) {}


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

  //Metodo para insertar un nuevo registro
  insertarRegistro() {
    this.registroService.createRegistro(this.registro).then(() => {
      this.registro = new Registro(); // Limpiar el formulario después de enviar
    });
  }
}   
