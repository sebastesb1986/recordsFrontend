import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LogClient } from 'src/app/models/log-client.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-modal-log-component',
  templateUrl: './modal-log-component.component.html',
  styleUrls: ['./modal-log-component.component.css']
})
export class ModalLogComponentComponent {

  logClients: LogClient[] = [];

  constructor(private clientService: ClientService,
    public bsModalRef: BsModalRef, private modalService: BsModalService) {
  }

  // Enviamos los datos a la ventana modal de los datos para el log de Client
  setLogClient(): void {

    this.clientService.logClients().subscribe((response: any) => {

      this.logClients = response.logsClient;

    });

  }

}
