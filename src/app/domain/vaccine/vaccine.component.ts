import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormVaccineComponent } from './form-vaccine/form-vaccine.component';
import { VaccineService } from '../../core/services/vaccine.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


export interface VaccineData {
  id: string;
  nameVaccine: string;
  typeVaccine: string;
  description: string;
  manufacturingDate: string;
  expirationDate: string;
  price: number;
  stock: number;
  active: boolean;
}

@Component({
  selector: 'app-vaccine',
  templateUrl: './vaccine.component.html',
  styleUrl: './vaccine.component.scss'
})
export class VaccineComponent implements OnInit{

  public displayedColumns: string[] = ['nameVaccine', 'typeVaccine', 'description', 'manufacturingDate', 'expirationDate', 'price', 'stock', 'action'];
  public dataSource: MatTableDataSource<VaccineData> = new MatTableDataSource<VaccineData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vaccineService: VaccineService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarVaccine();
  }                                         

  listarVaccine() {
    const listFunction = this.showButton ? this.vaccineService.listarInactive() : this.vaccineService.listarVaccine();
    listFunction.subscribe(
      (res: any) => {
        this.dataSource.data = res as VaccineData[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar clientes:', error);
      }
    );
  }

  downloadPDF() {
    const pdfUrl = this.showButton 
      ? 'https://humble-sniffle-vxvgr7v6q442pgrv-8080.app.github.dev/vaccines/reportInac'
      : 'https://humble-sniffle-vxvgr7v6q442pgrv-8080.app.github.dev/vaccines/report';
    window.open(pdfUrl, '_blank');
  }

  downloadXLS() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vacunas');

    // Guardar el archivo XLSX
    const wbout: Blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(wbout);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.showButton ? 'vacunas_inactivos.xlsx' : 'vacunas_activos.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  downloadCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const csvData: string = XLSX.utils.sheet_to_csv(ws);

    // Crear el archivo CSV
    const blob: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.showButton ? 'vacunas_inactivos.csv' : 'vacunas_activos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  toggleEstadoVaccines() {
    this.showButton = !this.showButton;
    this.listarVaccine();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(vaccine?: any) {
    const dlgRef = this.dialog.open(FormVaccineComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: vaccine
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarVaccine();
      }
    })
  }

  confirmarEliminarVaccine(vaccineId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarVaccine(vaccineId);
      }
    });
  }

  activarVaccine(vaccineId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a restaurar esta Vacuna.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vaccineService.activarVaccine(vaccineId).subscribe(
          () => {
            console.log('Vacuna activado correctamente');
            this.listarVaccine();
          },
          error => {
            console.error('Error al activar la Vacuna:', error);
          }
        );
      }
    });
  }


  eliminarVaccine(vaccineId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vaccineService.eliminarVaccine(vaccineId).subscribe(
          () => {
            console.log('Cliente eliminado correctamente');
            this.listarVaccine();
          },
          error => {
            console.error('Error al eliminar la Vacuna:', error);
          }
        );
      }
    });
  }
}
