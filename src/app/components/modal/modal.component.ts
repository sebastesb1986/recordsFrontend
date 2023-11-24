import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


defineLocale('es', esLocale);

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  form: FormGroup = this.fb.group({
    
    id: [''],
    businessid: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    start_at: ['', Validators.required],
    end_at: ['', Validators.required],

  });

  // Datepicker

  bsValue = new Date();
  minDate: Date = new Date();

  constructor(private clientService: ClientService,
    public bsModalRef: BsModalRef, private modalService: BsModalService, private localeService: BsLocaleService,
    private fb: FormBuilder, private toastr: ToastrService) {
  }


  ngOnInit(): void {

    this.localeService.use('es');

  }
  

  // 1. Cargamos datos de cliente en la ventana modal
  setClient(client: Client): void {

    this.form.patchValue({

      id: client.id,
      businessid: client.businessid,
      email: client.email,
      phone: client.phone,
      start_at: client.start_at,
      end_at: client.end_at,

    });

  }

  // 2. Registrar y Actualizar cliente
  saveClient() {

    // Actualizar cliente
    if (this.form.value.id > 0) {

      const startDate: Date = this.form.value.start_at;
      const endDate: Date = this.form.value.end_at;

      if (!(startDate instanceof Date)) {
        this.form.value.start_at = new Date(startDate);
      }

      if (!(endDate instanceof Date)) {
        this.form.value.end_at = new Date(endDate);
      }

      const endDateS = this.formatDate(this.form.value.start_at);
      const endDateE = this.formatDate(this.form.value.end_at);

      let json = {

        id: this.form.value.id,
        businessid: this.form.value.businessid,
        email: this.form.value.email,
        phone: this.form.value.phone,
        start_at: endDateS,
        end_at: endDateE


      }

      this.clientService.updateClient(json).subscribe({

        next: (data: any) => {
          // Actualización existosa
          this.toastr.success(data.success);
          this.actionClient();


        },
        error: errorService => {

          // Errores en los campos
          const err = errorService.error.errors;


          if (errorService.status == 422) {

            if (err.businessid != null) this.toastr.error(err.businessid[0]);
            if (err.email != null) this.toastr.error(err.email[0]);
            if (err.phone != null) this.toastr.error(err.phone[0]);
            if (err.start_at != null) this.toastr.error(err.start_at[0]);
            if (err.end_at != null) this.toastr.error(err.end_at[0]);


          }

        }

      });

    }
    else {

      // Registrar cliente
      const startDate = this.form.value.start_at != null ? this.formatDate(this.form.value.start_at) : '';
      const endDate =  this.form.value.end_at != null ? this.formatDate(this.form.value.end_at) : '';

      let json = {

        businessid: this.form.value.businessid,
        email: this.form.value.email,
        phone: this.form.value.phone,
        start_at: startDate,
        end_at: endDate


      }


      this.clientService.addClient(json).subscribe({

        next: (data: any) => {

          // Actualización existosa
          this.toastr.success(data.success);
          this.actionClient();

        },
        error: errorService => {

          // Errores en los campos
          const err = errorService.error.errors;


          if (errorService.status == 422) {

            if (err.businessid != null) this.toastr.error(err.businessid[0]);
            if (err.email != null) this.toastr.error(err.email[0]);
            if (err.phone != null) this.toastr.error(err.phone[0]);
            if (err.start_at != null) this.toastr.error(err.start_at[0]);
            if (err.end_at != null) this.toastr.error(err.end_at[0]);


          }

        }

      });

    }



  }

  // 3. Acción al momento de Actulizar o registrar un cliente
  actionClient() {

    this.clientService.listClients().subscribe((response: any) => {
  
       // Agregar o actualizar cliente con los nuevos datos
       const data = response.clients;
   
      this.clientService.clientUpdate.next(data);


      this.modalService.hide();


    });

  }

  //4. Formato de fecha
  formatDate(date: Date): string {
    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Agregar cero inicial si es necesario
    const day = ('0' + date.getDate()).slice(-2);  // Agregar cero inicial si es necesario

    // Formatear la fecha como YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }


}
