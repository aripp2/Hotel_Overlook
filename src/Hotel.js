import Customer from '../src/Customer';
import Booking from '../src/Booking';
import Order from '../src/Order';
import domUpdates from '../src/domUpdates';
  
class Hotel {
  constructor(date, rooms, bookings, orders, customers) {
    this.date = date;
    this.rooms = rooms;
    this.bookings = bookings.map(booking => new Booking(booking.userID, booking.date, booking.roomNumber));
    this.orders = orders.map(order => new Order(order.userID, order.date, order.food, order.totalCost));
    this.customers = customers.map(customer => new Customer(customer.id, customer.name, this.bookings, this.orders));
    this.todayBookings = [];
    this.todayOrders = [];
    this.selectedCustomer = null;
    this.menu = this.createMenu(orders); 
    // console.log(this.menu)
  }

// update tests

  getTodaysOrders() {
    this.todayOrders = this.orders.filter(order => order.date === this.date).sort((a, b) => a.userID - b.userID);
    domUpdates.appendTodaysOrders(this.todayOrders, this.customers);
    // return todayOrders;
  }

  getTodaysBookings() {
    this.todayBookings = this.bookings.filter(booking => booking.date === this.date).sort((a, b) => a.userID - b.userID);
    domUpdates.appendTodaysBookings(this.todayBookings, this.customers, this.rooms);
    // return todayBookings;
  }

  getCustomerById(id) {
    this.selectedCustomer = this.customers.find(customer => customer.id === id);
    domUpdates.appendSelectedGuest(this.selectedCustomer, this.rooms, this.date);
  }


  addNewCustomer(name) {
    this.selectedCustomer = new Customer(this.customers.length + 1, name, this.bookings, this.orders);
    this.customers.push(this.selectedCustomer);
    domUpdates.appendSelectedGuest(this.selectedCustomer, this.rooms, this.date);
    // return added;
  }

  getRoomsAvailable(date) {
    let bookedRooms = this.todayBookings.map(booking => booking.roomNumber);
    let available = this.rooms.filter(room => {
      if (!bookedRooms.includes(room.number)) {
        return room;
      }
    });
    domUpdates.appendAvailableRooms(available);
    return available;
  }

  getTotalRevenue(date) {
    let bookingsTotal = this.todayBookings.reduce((total, booking) => {
      this.rooms.find(room => {
        if (room.number === booking.roomNumber) {
        total += room.costPerNight;
        }
      });
      return total;
    }, 0);
    let ordersTotal = this.todayOrders.reduce((total2, order) => {
      total2 += order.totalCost;
      return total2;
    }, 0);
    return +(bookingsTotal + ordersTotal).toFixed(2);
  }

  getPercentOccupancy(date) {
    let percent = +(((this.todayBookings.length / this.rooms.length) * 100).toFixed(2));
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

  getBookingsPerDay() {
    return this.bookings.reduce((days, booking) => {
      if (!days[booking.date]) {
        days[booking.date] = 1;
      } else {
        days[booking.date] +=1
      }
      return days;
    }, {});
  }



}

export default Hotel;