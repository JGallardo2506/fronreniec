export interface Transaction {
  id: string;
  vaccineId: string; // Nuevo campo para almacenar el nombre de la vacuna
  applicationDate: string;
  dateRegistration: string;
  costApplication: number;
  amount: number;
  quantityBirds: number;
  email: string;
  active: boolean;
}



 