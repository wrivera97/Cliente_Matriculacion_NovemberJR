import {PeriodoAcademico} from './periodo-academico.model';
import {Malla} from './malla.model';

export class Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;

  constructor() {

  }
}
