class Customer {
  constructor(id, name, bookings = null, orders = null) {
    this.id = id;
    this.name = name;
    this.selectedBookings = this.findCustomerBookings(this.id, bookings);
    this.selectedOrders = this.findCustomerOrders(this.id, orders);
  }

  findCustomerBookings(id, bookings) {
    let customerBookings = bookings.filter(booking => booking.userID === id).sort((a, b) => a.date - b.date);
    return customerBookings;
  }
  findCustomerOrders(id, roomServices) {
    return roomServices.filter(order => order.userID === id).sort((a, b) => a.date - b.date);
  }

}

export default Customer;