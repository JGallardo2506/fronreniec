// src/app/core/models/Vaccine.model.ts

export interface Vaccine {
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


