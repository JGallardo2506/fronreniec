import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../core/services/transaction.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VaccineService } from '../../../core/services/vaccine.service'; // Asegúrate de que el servicio esté correctamente importado

@Component({
  selector: 'app-form-transaction',
  templateUrl: './form-transaction.component.html',
  styleUrls: ['./form-transaction.component.scss']
})
export class FormTransactionComponent implements OnInit {

  transactionForm: FormGroup = new FormGroup({});
  vaccines: any[] = []; // Cambiado a vaccines
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private vaccineService: VaccineService, // Corregido el nombre del servicio
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initTransactionForm();
    this.getVaccines(); // Cargar las vacunas al inicializar
    console.log('Data :', this.data);
  }

  // Cargar la lista de vacunas
  getVaccines(): void {
    this.vaccineService.listarVaccine().subscribe((res: any) => {
      console.log('Respuesta listar vacunas:', res);
      this.vaccines = res; // Cambiado a vaccines
      if (this.data) {
        this.initTransactionForm(); // Inicializa el formulario si hay datos
      }
    }, error => {
      console.error('Error al obtener vacunas:', error);
    });
  }

  // Para guardar un registro
  saveVaccine() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdateTransaction();
    } else {
      this.registerTransaction();
    }
  }

  // Enviar los datos del registro guardado
  registerTransaction() {
    this.transactionService.crearTransaction(this.transactionForm.value).subscribe((res: any) => {
      console.log('Respuesta registrar vacuna:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  // Confirmar la actualización de un registro
  confirmUpdateTransaction() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarTransaction();
      }
    });
  }

  // Actualizar cambios del registro
  actualizarTransaction() {
    this.transactionService.actualizarTransaction(this.data.id, this.transactionForm.value).subscribe((res: any) => {
      console.log('Respuesta actualizar vacuna:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    });
  }

  // Inicializar el formulario
  initTransactionForm() {
    this.transactionForm = this.fb.group({
      vaccineId: ['', [Validators.required]],
      applicationDate: ['', [Validators.required]],
      dateRegistration: ['', [Validators.required]],
      costApplication: ['', [Validators.required]],
      email: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      quantityBirds: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.data) {
      const dataCopy = { ...this.data }; // Hacer una copia para evitar modificar datos originales
      this.transactionForm.patchValue(dataCopy);
    }
  }

  get form() {
    return this.transactionForm.controls;
  }

  // Método para cerrar el diálogo
  cancelar(success?: boolean) {
    this.dialogRef.close(success);
  }

  // Notificación de guardado exitoso
  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Registro añadido exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  // Notificación de actualización exitosa
  showSuccessMessageUpdate() {
    Swal.fire({
      icon: 'success',
      title: 'Registro actualizado exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
