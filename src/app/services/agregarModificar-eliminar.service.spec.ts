import { TestBed } from '@angular/core/testing';
import { AgregarModificarEliminarService } from './agregarModificar-eliminar.service';

describe('ModificarEliminarService', () => {
  let service: AgregarModificarEliminarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgregarModificarEliminarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
