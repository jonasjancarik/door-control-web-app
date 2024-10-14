export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'apartment_admin' | 'guest';
    apartment_number: string;
    recurring_schedules?: RecurringGuestSchedule[];
    one_time_access?: OneTimeGuestAccess[];
}

export interface PIN {
    id: number;
    label: string;
    created_at: string;
}

export interface RFID {
    id: number;
    user_id: number;
    hashed_uuid: string;
    last_four_digits: string;
    label: string;
    creator_email: string;
    created_at: string;
}

export interface RecurringGuestSchedule {
    id: number;
    user_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface OneTimeGuestAccess {
    id: number;
    user_id: number;
    access_date: string;
    start_time: string;
    end_time: string;
}

export interface Apartment {
    id: number;
    number: string;
    description: string;
    users: User[];
}
