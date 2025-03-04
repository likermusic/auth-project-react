export interface AuthDTO {
  user: {
    id: string;
    login: string;
  };
  token: string;
}
