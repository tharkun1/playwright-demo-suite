import { test, expect } from '@playwright/test';
import { BookingApi, API_URL, type Booking } from '../../api/BookingApi';

// API tests: no browser, Playwright sends HTTP requests directly
test.use({ baseURL: API_URL });

const newBooking: Booking = {
  firstname: 'Dariusz',
  lastname: 'Test',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
  additionalneeds: 'Breakfast',
};

test.describe('Booking API', () => {
  test('GET /booking returns a list of booking ids', async ({ request }) => {
    const res = await new BookingApi(request).list();

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('POST /booking creates a booking that GET returns unchanged', async ({ request }) => {
    const api = new BookingApi(request);

    const created = await api.create(newBooking);
    expect(created.status()).toBe(200);
    const { bookingid, booking } = await created.json();
    expect(booking).toEqual(newBooking);

    const fetched = await api.get(bookingid);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(newBooking);
  });

  test('PUT updates and DELETE removes a booking (with auth token)', async ({ request }) => {
    const api = new BookingApi(request);
    const { bookingid } = await (await api.create(newBooking)).json();
    const token = await api.token();
    expect(token).toBeTruthy();

    const changed = { ...newBooking, totalprice: 300, additionalneeds: 'Late checkout' };
    const updated = await api.update(bookingid, changed, token);
    expect(updated.status()).toBe(200);
    expect(await updated.json()).toEqual(changed);

    const deleted = await api.remove(bookingid, token);
    expect(deleted.status()).toBe(201); // restful-booker answers 201 Created on delete (documented quirk)
    expect((await api.get(bookingid)).status()).toBe(404);
  });
});
