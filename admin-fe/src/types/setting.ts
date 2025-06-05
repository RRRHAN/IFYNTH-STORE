export type Register = {
  Username: string;
  Name: string;
  PhoneNumber: string;
  Password: string;
  ConfirmedPassword: string;
};

export type AdminActivity = {
  UserID: string;
  Name: string;
  Description: string;
  CreatedAt: string;
}
