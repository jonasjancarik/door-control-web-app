export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'apartment_admin' | 'guest';
    apartment_number: string;
}

export interface Pin {
    id: number;
    label: string;
    created_at: string;
}

export interface RFID {
    user_id: number;
    hashed_uuid: string;
    label: string;
    creator_email: string;
    created_at: string;
}
