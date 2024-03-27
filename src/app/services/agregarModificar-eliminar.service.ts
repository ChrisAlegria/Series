import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { Genero } from '../models/generos';



@Injectable({
  providedIn: 'root'
})
export class AgregarModificarEliminarService {

  constructor(private firestore:AngularFirestore) { }

  //Metodo que retorna el arreglo de clientes
  getClientes(){
    return this.firestore.collection('regitros').snapshotChanges();
  }

  // Método para insertar un registro 
  createRegistro(registro:Registro){
    return this.firestore.collection('registros').add(Object.assign({},registro))
  }

  // Método para actualizar un documento existente
  updateRegistro(registro: Registro) {
    this.firestore.doc('registros/' + registro.id).update(registro);
  }

  // Método para eliminar un documento
  deleteRegistro(registroId: string) {
    this.firestore.doc('registros/' + registroId).delete();
  }

  guardarGeneroEnFirebase(nuevoGenero: string) {
    // Aquí debes escribir el código para guardar el nuevo género en Firebase
    // Por ejemplo:
    this.firestore.collection('generos').add({ genero: nuevoGenero })
      .then(() => {
        console.log('Nuevo género agregado correctamente a Firebase.');
      })
      .catch(error => {
        console.error('Error al agregar el nuevo género:', error);
      });
  }
}




