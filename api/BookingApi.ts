import { type APIRequestContext, type APIResponse } from '@playwright/test';

// API client for the public practice API https://restful-booker.herokuapp.com
// Same idea as a Page Object: tests call methods, endpoints live in one place.
export const API_URL = 'https://restful-booker.herokuapp.com';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export class BookingApi {
  constructor(private readonly request: APIRequestContext) { }

  async list(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  async get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } });
  }

  async create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking, headers: { Accept: 'application/json' } });
  }

  // Returns a token needed for update and delete (public demo account from the API docs)
  async token(): Promise<string> {
    const res = await this.request.post('/auth', { data: { username: 'admin', password: 'password123' } });
    return (await res.json()).token;
  }

  async update(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: { Accept: 'application/json', Cookie: `token=${token}` },
    });
  }

  async remove(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
