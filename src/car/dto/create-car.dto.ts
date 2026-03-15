export class CreateCarDto {
  title: string;
  brand: string;
  filePath: string;
  seatCapacity: number;
  horsePower: number;
  maxGasoline: number;
  transmissionType: string;
  dailyRate: number;
  categoryId: number;
  images?: string[];
}
