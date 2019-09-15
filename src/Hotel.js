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
    this.selectedCustomer = null;
    this.menu = this.createMenu(orders); 
    // console.log(this.menu)
  }

  getTodaysOrders() {
    return this.orders.filter(order => order.date === this.date);
  }

  getTodaysBookings() {
    return this.bookings.filter(booking => booking.date === this.date)
  }

  getCustomerById(id) {
    this.selectedCustomer = this.customers.find(customer => customer.id === id);
    // include find by name
    // error if not found
  }

  addNewCustomer(name) {
    let added = new Customer(this.customers.length + 1, name);
    this.customers.push(added);
    return added;
  }

  getRoomsAvailable(date) {
    let bookedRooms = this.getTodaysBookings().map(booking => booking.roomNumber);
    return this.rooms.filter(room => {
      if (!bookedRooms.includes(room.number)) {
        return room;
      }
    });
  }

  getTotalRevenue(date) {
    let bookingsTotal = this.getTodaysBookings(date).reduce((total, booking) => {
      this.rooms.find(room => {
        if (room.number === booking.roomNumber) {
        total += room.costPerNight;
        }
      });
      return total;
    }, 0);
    let ordersTotal = this.getTodaysOrders(date).reduce((total2, order) => {
      total2 += order.totalCost;
      return total2;
    }, 0);
    return +(bookingsTotal + ordersTotal).toFixed(2);
  }

  getPercentOccupancy(date) {
    let percent = +(((this.getTodaysBookings().length / this.rooms.length) * 100).toFixed(2));
  return percent;
  }

  unbookRoom(booking) {
    let roomToUnbook = this.bookings.findIndex(reservation => {
      return JSON.stringify(Object.values(reservation)) === JSON.stringify(Object.values(booking));
    });
    this.bookings.splice(roomToUnbook, 1);
  }

  bookRoom(id, day, rmNum) {
    // let availableRooms = getRoomsAvailable(day);
    this.bookings.push(new Booking(id, day, rmNum));
  }

  createMenu(orders) {
    return this.orders.reduce((items, order) => {
      if (!items.includes({food: order.food, price: order.totalCost})) {
        items.push({food: order.food, price: order.totalCost});
      }
      return items;
    }, []).sort((a, b) => a.price - b.price);
  }

  orderFood(id, date, food, cost) {
    this.orders.push(new Order(id, date, food, cost));
  }




}

export default Hotel;