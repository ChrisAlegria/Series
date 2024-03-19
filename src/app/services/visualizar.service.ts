import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class VisualizarService {

  constructor(private firestore: AngularFirestore) { }

  getRegistros(): Observable<Registro[]> {
    return this.firestore.collection<Registro>('registros').valueChanges();
  }
}
