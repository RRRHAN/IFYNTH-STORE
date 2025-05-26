export interface TotalTransactionUser {
  UserID: string;
  CustomerName: string;
  PhoneNumber: string;
  TotalTransaction: number;
  TotalAmount: number;
}

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