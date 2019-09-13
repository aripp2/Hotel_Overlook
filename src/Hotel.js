class Hotel {
  constructor(date, rooms, bookings, orders, customers) {
    this.date = date;
    this.rooms = rooms;
    this.bookings = bookings;
    this.orders = orders;
    this.customers = customers;
  }

  getTodaysOrders() {
    return this.orders.filter(order => order.date === this.date);
  }

  getTodaysBookings() {
    return this.bookings.filter(booking => booking.date === this.date)
  }
}

export default Hotel;