import { Permission } from "../permissions/permissionType";

export interface User {
    id: number;
    username: string;
    first_name: string;
    email: string;
    telephone: string;
    cpf: string;
    user_type: string;
    registration_date: string;
    permissions: Permission[];
}
  