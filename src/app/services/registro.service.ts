import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4';


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

    getPoster(nombre: string, anio: number): Observable<any> {
      const apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4';
      const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${nombre}&first_air_date_year=${anio}`;
      return this.http.get(url);
    }

  // Método para obtener los backdrops de una serie
  getBackdrops(nombreSerie: string, anio: number): Observable<any> {
    const apiKey = '9acebb52c9e5a9a8ca10f58f1543d5d4';
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${nombreSerie}&first_air_date_year=${anio}`;
    return this.http.get(url);
  }
}
