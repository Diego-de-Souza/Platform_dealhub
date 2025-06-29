import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  role: string; 
  id?: string; 
  name?: string;
}