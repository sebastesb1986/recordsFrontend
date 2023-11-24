import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from 'src/app/models/client.model';
import { Subject } from 'rxjs';
import { LogClient } from '../models/log-client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // Recibir los cambios si se agrega o actualiza desde la ventana modal
  clientUpdate = new Subject<Client[]>();

  private url = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { }

  // 1. Obtenermos la lista de clientes
  listClients() {
    //string literal
    return this.http.get<Client[]>(`${this.url}/clients`);
  }

  // 2. Registrar cliente
  addClient(json: any) {

    return this.http.post(`${this.url}/create-client`, json);

  }

  // 3. Actualizar cliente
  updateClient(json: any) {
    return this.http.put(`${this.url}/update-client/${json.id}`, json);

  }

  // 4. Buscar cliente
  searchClient(id: number) {
    //string literal
    return this.http.get(`${this.url}/${id}/get`);
  }

   // 5. Obtenermos logs de los clientes
   logClients() {
    //string literal
    return this.http.get<LogClient[]>(`${this.url}/logsClient`);
  }


}
