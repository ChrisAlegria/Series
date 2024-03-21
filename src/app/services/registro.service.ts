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

  // Método para obtener los géneros
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

  // Método para obtener un registro por su nombre
  getRegistroPorNombre(nombre: string) {
    return this.firestore.collection<Registro>('registros', ref =>
      ref.where('nombre', '==', nombre)
    ).valueChanges();
  }


  // Método para obtener la imagen de una serie
  getImagenSerie(nombreSerie: string): Observable<any> {
    const apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4'; // Reemplaza 'TU_API_KEY' con tu propia clave de API de The Movie Database
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${nombreSerie}`;
    return this.http.get(url);
  }

  // Método para obtener los registros
  getRegistros(){
    return this.firestore.collection('registros').snapshotChanges();
  }

  // Método para obtener el ID de una serie
  getSerieId(nombreSerie: string): Observable<any> {
    const apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4';
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${nombreSerie}`;
    return this.http.get(url);
  }

  // Método para obtener el logo de Fanart de una serie
  getFanartLogo(serieId: string): Observable<any> {
    const apiKey = 'e4dd9d5f09fa05937f75431e95fe1a29'; // Reemplaza 'YOUR_API_KEY' con tu propia clave de API de Fanart.tv
    const url = `https://webservice.fanart.tv/v3/movies/${serieId}?api_key=${apiKey}`;
    return this.http.get(url);
  } 
}