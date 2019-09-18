class Customer {
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

  // getTotalBill(date, rooms) {
  //   let bookingsBill = this.selectedBookings.reduce((bill, booking) => {
  //     if (booking.date === date) {

  //       bill += rooms.find(room => room.number === booking.roomNumber).costPerNight;
  //     }
  //     return bill;
  //   }, 0);
  //   console.log(bookingsBill)
  // }
  
}

export default Customer;