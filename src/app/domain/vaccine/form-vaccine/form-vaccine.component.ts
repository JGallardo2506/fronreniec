import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VaccineService } from '../../../core/services/vaccine.service'; // Asegúrate de que el servicio esté correctamente importado
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import moment from 'moment';



@Component({
  selector: 'app-form-vaccine',
  templateUrl: './form-vaccine.component.html',
  styleUrls: ['./form-vaccine.component.scss']
})
export class FormVaccineComponent implements OnInit {

  vaccineForm: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private vaccineService: VaccineService, // Ajusta el nombre del servicio
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initVaccineForm();
    console.log('Data :', this.data);
  }

  // Validación para ser mayor de edad (puedes eliminar si no es relevante para vacunas)
  adultValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = moment(control.value);
      const age = moment().diff(date, 'years');
      return age >= 18 ? null : { notAdult: true };
    };
  }

  // Para guardar un registro
  saveVaccine() {
    if (this.vaccineForm.invalid) {
      this.vaccineForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdateVaccine();
    } else {
      this.registerVaccine();
    }
  }

  // Enviar los datos del registro guardado
  registerVaccine() {
    this.vaccineService.crearVaccine(this.vaccineForm.value).subscribe((res: any) => {
      console.log('Respuesta registrar vacuna:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  // Confirmar la actualización de un registro
  confirmUpdateVaccine() {
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
        this.actualizarVaccine();
      }
    });
  }

  // Actualizar cambios del registro
  actualizarVaccine() {
    this.vaccineService.actualizarVaccine(this.data.id, this.vaccineForm.value).subscribe((res: any) => {
      console.log('Respuesta actualizar vacuna:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    });
  }

  // Validación para el formulario
  initVaccineForm() {
    this.vaccineForm = this.fb.group({
      nameVaccine: ['', [Validators.required]],
      typeVaccine: ['', [Validators.required]],
      description: ['', [Validators.required]],
      manufacturingDate: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.data) {
      const dataCopy = { ...this.data }; // Make a copy to avoid modifying original data
      this.vaccineForm.patchValue(dataCopy);
    }
  }

  get form() {
    return this.vaccineForm.controls;
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
