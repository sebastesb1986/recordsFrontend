import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import * as saveAs from 'file-saver';
import { LogClient } from 'src/app/models/log-client.model';
import { ModalLogComponentComponent } from '../modal-log-component/modal-log-component.component';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients: Client[] = [];
  logClients: LogClient[] = [];

  modalRef: BsModalRef | undefined;

  constructor(private clientService: ClientService, private modalService: BsModalService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getClients();
    this.listRefresh();

  }

  // 0. Refresh lista clients despues de agregar o actualizar
  listRefresh() {

    this.clientService.clientUpdate.subscribe(data => {

      this.clients = data;

      
    });

  }

  // 1. Obtener lista de clientes registrados
  getClients() {
    this.clientService.listClients().subscribe((response: any) => {

      this.clients = response.clients;

    })
  }

  // 2. Guardar cambios
  saveClient(clients?: any) {

    let client = ((clients != null) ? clients : new Client());

    // Se agrega el componente Modal(interfaz y datos) a la ventana modal 
    this.modalRef = this.modalService.show(ModalComponent, { class: 'modal-md' });

    // Pasamos los datos de la clients seleccionada a la ventana modal
    this.modalRef.content.setClient(client);
  }

  // 3. Buscar cliente
  search(event: any) {

    // Asignamos a una constante lo recibido en la caja de texto
    const text = event.target.value;
    const valor = text.trim().toLowerCase();

    // Si el campo de búsqueda está vacío, restaura la lista completa
    if (!valor) {

      this.getClients();

    }

    // Filtrar la lista de clientes basándose en el valor ingresado
    this.clients = this.clients.filter((clients: any) => {
      // Itera a través de las propiedades del objeto clients
      for (const prop in clients) {
        if (prop !== 'id' && clients.hasOwnProperty(prop) && typeof clients[prop] === 'string') {
          // Realiza la búsqueda en minúsculas para asegurar la coincidencia
          if (clients[prop].toLowerCase().includes(valor)) {
            return true;
          }
        } else if (prop !== 'id' && typeof clients[prop] === 'number') {
          // Convierte el número a cadena y busca la coincidencia
          if (clients[prop].toString().includes(valor)) {
            return true;
          }
        }
      }

      // Si no se encuentra ninguna coincidencia retorna false
      return false;

    });

  }

  // 4. Exportar lista de clientes a CSV
  exportToCSV() {
    
    // Datos de clientes a exportar
    const data = this.clients;
  
    // Convierte los datos a formato CSV
    const csvData = this.convertToCSV(data);
  
    // datos CSV
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  
    // Guardar CSV de clients
    saveAs(blob, 'clientes.csv');
  }
  
  private convertToCSV(data: any[]): string {

    const header = Object.keys(data[0]).join(';') + '\n';
    const csv = data.map(item => Object.values(item).join(';')).join('\n');
    return header + csv;

  }

  // 5. Obtener logs
  logClient() {

    // Se agrega el componente Modal(interfaz y datos) a la ventana modal 
    this.modalRef = this.modalService.show(ModalLogComponentComponent, { class: 'modal-md' });

    // Pasamos los datos de la clients seleccionada a la ventana modal
    this.modalRef.content.setLogClient(this.logClients);
  }

}
