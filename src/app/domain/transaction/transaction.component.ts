import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormTransactionComponent } from './form-transaction/form-transaction.component';
import { TransactionService } from '../../core/services/transaction.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


export interface TransactionData {
    id: string;
    vaccineId: string;
    applicationDate: string;
    dateRegistration: string;
    costApplication: number;
    amount: number;
    quantityBirds: number;
    email: string;
    active: boolean;
}




@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit{

  public displayedColumns: string[] = ['vaccineId', 'applicationDate', 'dateRegistration', 'costApplication', 'amount','quantityBirds', 'email', 'action'];
  public dataSource: MatTableDataSource<TransactionData> = new MatTableDataSource<TransactionData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTransaction();
  }                                         

  listarTransaction() {
    const listFunction = this.showButton ? this.transactionService.listarInactive() : this.transactionService.listarTransaction();
    listFunction.subscribe(
      (res: any) => {
        this.dataSource.data = res as TransactionData[];
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

  toggleEstadoTransaction() {
    this.showButton = !this.showButton;
    this.listarTransaction();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(transaction?: any) {
    const dlgRef = this.dialog.open(FormTransactionComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: transaction
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarTransaction();
      }
    })
  }

  confirmarEliminarTransaction(transactionId: number) {
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
        this.eliminarTransaction(transactionId);
      }
    });
  }

  activarTransaction(transactionId: number) {
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
        this.transactionService.activarTransaction(transactionId).subscribe(
          () => {
            console.log('Vacuna activado correctamente');
            this.listarTransaction();
          },
          error => {
            console.error('Error al activar la Vacuna:', error);
          }
        );
      }
    });
  }


  eliminarTransaction(transactionId: number) {
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
        this.transactionService.eliminarTransaction(transactionId).subscribe(
          () => {
            console.log('Cliente eliminado correctamente');
            this.listarTransaction();
          },
          error => {
            console.error('Error al eliminar la Vacuna:', error);
          }
        );
      }
    });
  }

}
