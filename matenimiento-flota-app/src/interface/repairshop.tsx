export interface RepairShop {
  id: string;
  address: string;
  city: string;
  name: string;
  phone: string;
  type: string;
}

export interface Order {
  vehicle: string;
  repairshop: string;
  mandated: string;
  faults: string[];
  state: string;
  comments: string;
  type: string;
  id: string;
  repairshopName: string;
  repairshopAddress: string;
  vehicleMarca: string;
  vehicleMotor: string;
  vehicleTipo: string;
  vehicleTipoVehi: string;
  vehiclePropiedad: string;
  mandatedName: string;
  mandatedEmail: string;
  entry_date: Date;
  delivery_date: Date;
  price: string;
  url: string;
}


