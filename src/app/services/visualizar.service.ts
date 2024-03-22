import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class VisualizarService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) { }

  getRegistros(): Observable<Registro[]> {
    return this.firestore.collection<Registro>('registros').valueChanges();
  }
}
