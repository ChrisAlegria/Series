import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private firestore:AngularFirestore, private http: HttpClient) { }

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

  getImagenSerie(nombreSerie: string): Observable<any> {
    const apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4'; // Reemplaza 'TU_API_KEY' con tu propia clave de API de The Movie Database
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${nombreSerie}`;
    return this.http.get(url);
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
