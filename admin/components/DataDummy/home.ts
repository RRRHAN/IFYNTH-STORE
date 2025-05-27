import { TransactionReport } from "@/src/types/home";

export interface TotalTransactionUser {
  UserID: string;
  CustomerName: string;
  PhoneNumber: string;
  TotalTransaction: number;
  TotalAmount: number;
}

export const dummyTransactionReports: TransactionReport[] = [
  { Date: "2025-05-01", TotalAmount: 125000 },
  { Date: "2025-05-02", TotalAmount: 150000 },
  { Date: "2025-05-03", TotalAmount: 110000 },
  { Date: "2025-05-04", TotalAmount: 180000 },
  { Date: "2025-05-05", TotalAmount: 95000 },
  { Date: "2025-05-06", TotalAmount: 200000 },
  { Date: "2025-05-07", TotalAmount: 175000 },
  { Date: "2025-05-08", TotalAmount: 220000 },
  { Date: "2025-05-09", TotalAmount: 130000 },
  { Date: "2025-05-10", TotalAmount: 250000 },
  { Date: "2025-05-11", TotalAmount: 100000 },
  { Date: "2025-05-12", TotalAmount: 160000 },
  { Date: "2025-05-13", TotalAmount: 190000 },
  { Date: "2025-05-14", TotalAmount: 145000 },
  { Date: "2025-05-15", TotalAmount: 230000 },
  { Date: "2025-05-16", TotalAmount: 115000 },
  { Date: "2025-05-17", TotalAmount: 240000 },
  { Date: "2025-05-18", TotalAmount: 185000 },
  { Date: "2025-05-19", TotalAmount: 210000 },
  { Date: "2025-05-20", TotalAmount: 170000 },
  { Date: "2025-05-21", TotalAmount: 260000 },
  { Date: "2025-05-22", TotalAmount: 135000 },
  { Date: "2025-05-23", TotalAmount: 270000 },
  { Date: "2025-05-24", TotalAmount: 195000 },
  { Date: "2025-05-25", TotalAmount: 280000 },
  { Date: "2025-05-26", TotalAmount: 205000 }, // Tanggal terakhir di screenshot Anda
  { Date: "2025-05-27", TotalAmount: 300000 }, // Hari ini
  { Date: "2025-05-28", TotalAmount: 215000 },
  { Date: "2025-05-29", TotalAmount: 290000 },
  { Date: "2025-05-30", TotalAmount: 225000 },
];

// Untuk digunakan di komponen atau di mana pun Anda memanggil data
export const dummyTotalTransactionUsers: TotalTransactionUser[] = [
  {
    UserID: "user_001",
    CustomerName: "Budi Santoso",
    PhoneNumber: "081234567890",
    TotalTransaction: 15,
    TotalAmount: 1500000,
  },
  {
    UserID: "user_002",
    CustomerName: "Siti Aminah",
    PhoneNumber: "082345678901",
    TotalTransaction: 22,
    TotalAmount: 2300000,
  },
  {
    UserID: "user_003",
    CustomerName: "Joko Susilo",
    PhoneNumber: "083456789012",
    TotalTransaction: 8,
    TotalAmount: 750000,
  },
  {
    UserID: "user_004",
    CustomerName: "Dewi Lestari",
    PhoneNumber: "085678901234",
    TotalTransaction: 30,
    TotalAmount: 3200000,
  },
  {
    UserID: "user_005",
    CustomerName: "Ahmad Riyadi",
    PhoneNumber: "087890123456",
    TotalTransaction: 12,
    TotalAmount: 1100000,
  },
  {
    UserID: "user_006",
    CustomerName: "Fitri Handayani",
    PhoneNumber: "081122334455",
    TotalTransaction: 18,
    TotalAmount: 1900000,
  },
  {
    UserID: "user_007",
    CustomerName: "Rizky Pratama",
    PhoneNumber: "082233445566",
    TotalTransaction: 7,
    TotalAmount: 600000,
  },
  {
    UserID: "user_008",
    CustomerName: "Putri Rahayu",
    PhoneNumber: "083344556677",
    TotalTransaction: 25,
    TotalAmount: 2800000,
  },
  {
    UserID: "user_009",
    CustomerName: "Dedi Setiawan",
    PhoneNumber: "085566778899",
    TotalTransaction: 10,
    TotalAmount: 950000,
  },
  {
    UserID: "user_010",
    CustomerName: "Kartika Sari",
    PhoneNumber: "087788990011",
    TotalTransaction: 35,
    TotalAmount: 4000000,
  },
  {
    UserID: "user_011",
    CustomerName: "Eko Prasetyo",
    PhoneNumber: "081828384858",
    TotalTransaction: 11,
    TotalAmount: 980000,
  },
  {
    UserID: "user_012",
    CustomerName: "Linda Wijaya",
    PhoneNumber: "082939495969",
    TotalTransaction: 19,
    TotalAmount: 2050000,
  },
  {
    UserID: "user_013",
    CustomerName: "Fajar Nugraha",
    PhoneNumber: "083040506070",
    TotalTransaction: 6,
    TotalAmount: 550000,
  },
];

// Di file tempat Anda menggunakan ProfitProductChart, misalnya SomeScreen.tsx

export const dummyProfitProducts = [
  {
    ProductID: "prod-001", // <--- Tambahkan ini
    ProductName: "Laptop Gaming A",
    TotalCapital: 10000000,
    TotalIncome: 12500000,
  },
  {
    ProductID: "prod-002", // <--- Tambahkan ini
    ProductName: "Smartphone B",
    TotalCapital: 5000000,
    TotalIncome: 6200000,
  },
  {
    ProductID: "prod-003", // <--- Tambahkan ini
    ProductName: "Headphone C",
    TotalCapital: 750000,
    TotalIncome: 900000,
  },
  {
    ProductID: "prod-004", // <--- Tambahkan ini
    ProductName: "Smartwatch D",
    TotalCapital: 2000000,
    TotalIncome: 2800000,
  },
  {
    ProductID: "prod-005", // <--- Tambahkan ini
    ProductName: "Keyboard E",
    TotalCapital: 300000,
    TotalIncome: 450000,
  },
  {
    ProductID: "prod-006", // <--- Tambahkan ini
    ProductName: "Mouse F",
    TotalCapital: 150000,
    TotalIncome: 200000,
  },
  {
    ProductID: "prod-007", // <--- Tambahkan ini
    ProductName: "Monitor G",
    TotalCapital: 7000000,
    TotalIncome: 8500000,
  },
  {
    ProductID: "prod-008", // <--- Tambahkan ini
    ProductName: "Printer H",
    TotalCapital: 4000000,
    TotalIncome: 4900000,
  },
  {
    ProductID: "prod-009", // <--- Tambahkan ini
    ProductName: "Webcam I",
    TotalCapital: 250000,
    TotalIncome: 300000,
  },
  {
    ProductID: "prod-010", // <--- Tambahkan ini
    ProductName: "SSD J",
    TotalCapital: 900000,
    TotalIncome: 1100000,
  },
];
