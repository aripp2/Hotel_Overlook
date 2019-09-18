class Guest {
  constructor(id, name, bookings = null, orders = null) {
    this.id = id;
    this.name = name;
    this.selectedBookings = this.findCustomerBookings(this.id, bookings);
    this.selectedOrders = this.findCustomerOrders(this.id, orders);
  }

  findCustomerBookings(id, bookings) {
    return bookings.filter(booking => booking.userID === id);
  }

  findCustomerOrders(id, roomServices) {
    return roomServices.filter(order => order.userID === id);
  }
  
}

export default Guest;