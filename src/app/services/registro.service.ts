import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private firestore:AngularFirestore) { }

  getGeneros() {  
    return this.firestore.collection('generos').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as { genero: string };
          const genero = data.genero;
          return genero;
        });
      })
    );
  }

  getRegistroPorNombre(nombre: string) {
    return this.firestore.collection<Registro>('registros', ref =>
      ref.where('nombre', '==', nombre)
    ).valueChanges();
  }


  //Metodo que permite tener 2 documentos en la coleccion
  getRegistros(){
    return this.firestore.collection('registros').snapshotChanges();
  }

  //Metodo para insertar un documento 
  createRegistro(registro:Registro){
    return this.firestore.collection('registros').add(Object.assign({},registro))
  }
}
