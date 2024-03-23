export class Registro{
    id!:string;
    nombre!:string;
    descripcion!:string;
    genero!: string[]; // Cambio de una sola cadena a un array de cadenas
    anio!:number;
    porcentajeCalificacion!: number;
    imagenSerie!: string;
    tvId!: number;
}