import Customer from '../src/Customer';
import Booking from '../src/Booking';
import Order from '../src/Order';
  
class Hotel {
  constructor(date, rooms, bookings, orders, customers) {
    this.date = date;
    this.rooms = rooms;
    this.bookings = bookings.map(booking => new Booking(booking.userID, booking.date, booking.roomNumber));
    this.orders = orders.map(order => new Order(order.userID, order.date, order.food, order.totalCost));
    this.customers = customers.map(customer => new Customer(customer.id, customer.name, this.bookings, this.orders));
    // console.log(this)
  }

  getTodaysOrders() {
    return this.orders.filter(order => order.date === this.date);
  }

  getTodaysBookings() {
    return this.bookings.filter(booking => booking.date === this.date)
  }

  getCustomerById(id) {
    return this.customers.find(customer => customer.id === id);
  }

  addNewCustomer(name) {
    let added = new Customer(this.customers.length + 1, name);
    this.customers.push(added);
    return added;
  }
}

export default Hotel;