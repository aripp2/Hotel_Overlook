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
    this.todayBookings = this.getTodaysBookings();
    console.log(this.todayBookings)
    this.todayOrders = this.getTodaysOrders();
    this.selectedCustomer = null;
    this.menu = this.createMenu(orders); 
    // console.log(this.menu)
  }

// update tests


  getTodaysOrders() {
    this.todayOrders = this.orders.filter(order => order.date === this.date).sort((a, b) => a.userID - b.userID);
    let namedOrders = this.todayOrders.map(order => {
      let guest = this.customers.find(customer => customer.id === order.userID);
      return {
        userID: order.userID,
        guest: guest.name,
        food: order.food,
        totalCost: order.totalCost
      }
    });
    domUpdates.appendTodaysOrders(namedOrders);
    // return todayOrders;
  }

  getTodaysBookings() {
    this.todayBookings = this.bookings.filter(booking => booking.date === this.date).sort((a, b) => a.userID - b.userID);
    let namedBookings = this.todayBookings.map(booking => {
      let guest = this.customers.find(customer => customer.id === booking.userID);
      return {
        userID: booking.userID,
        guest: guest.name,
        roomNumber: booking.roomNumber
      }
    });
    console.log(this.todayBookings)
    domUpdates.appendTodaysBookings(namedBookings);
    // return todayBookings;
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
    let bookedRooms = this.todayBookings.map(booking => booking.roomNumber);
    return this.rooms.filter(room => {
      if (!bookedRooms.includes(room.number)) {
        return room;
      }
    });
  }

  getTotalRevenue(date) {
    console.log(this.todayBookings)
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




}

export default Hotel;