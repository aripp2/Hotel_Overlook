import Guest from '../src/Guest';
import Booking from '../src/Booking';
import Order from '../src/Order';
import domUpdates from '../src/domUpdates';
  
class Hotel {
  constructor(date, rooms, bookings, orders, guests) {
    this.date = date;
    this.rooms = rooms;
    this.bookings = bookings.map(booking => new Booking(booking.userID, booking.date, booking.roomNumber));
    this.orders = orders.map(order => new Order(order.userID, order.date, order.food, order.totalCost));
    this.guests = guests.map(guest => new Guest(guest.id, guest.name, this.bookings, this.orders));
    this.todayBookings = [];
    this.todayOrders = [];
    this.selectedGuest = null;
    this.menu = this.createMenu(); 
  }

  getTodaysOrders() {
    this.todayOrders = this.orders.filter(order => order.date === this.date).sort((a, b) => a.userID - b.userID);
    domUpdates.appendTodaysOrders(this.todayOrders, this.guests);
  }

  getTodaysBookings() {
    this.todayBookings = this.bookings.filter(booking => booking.date === this.date).sort((a, b) => a.userID - b.userID);
    domUpdates.appendTodaysBookings(this.todayBookings, this.guests, this.rooms);
  }

  getGuestById(id) {
    this.selectedGuest = this.guests.find(guest => guest.id === id);
  }

  getGuestBookingsTotalToday(id, date) {
    return +(this.bookings.reduce((bill, booking) => {
      if (booking.date === date && booking.userID === id) {

        bill += this.rooms.find(room => room.number === booking.roomNumber).costPerNight;
      }
      return bill;
    }, 0)).toFixed(2);
  }

  getGuestOrdersTotalToday(id, date) {
    return +(this.orders.reduce((bill, order) => {
      if (order.date === date && order.userID === id) {
        bill += order.totalCost;
      }
      return bill;
    }, 0)).toFixed(2);
  }

  getGuestTotalBillToday(id, date) {
    let bookingsBill = this.getGuestBookingsTotalToday(id, date);
    let ordersBill = this.getGuestOrdersTotalToday(id, date);
    let total = +(bookingsBill + ordersBill).toFixed(2);
    return total;
  }

  getGuestAllTimeBookingsTotal(id) {
    return +(this.bookings.reduce((total, booking) => {
      if (booking.userID === id) {
        total += this.rooms.find(room => room.number === booking.roomNumber).costPerNight;
      }
      return total;
    }, 0)).toFixed(2);
  }

  getGuestAllTimeOrdersTotal(id) {
    return +(this.orders.reduce((total, order) => {
      if (order.userID === id) {
        total += order.totalCost;
      }
      return total;
    }, 0)).toFixed(2);
  }


  addNewGuest(name) {
    this.selectedGuest = new Guest(this.guests.length + 1, name, this.bookings, this.orders);
    this.guests.push(this.selectedGuest);
  }

  getRoomsAvailable(date) {
    let bookedRooms = this.todayBookings.map(booking => booking.roomNumber);
    let available = this.rooms.filter(room => {
      if (!bookedRooms.includes(room.number)) {
        return room;
      }
    });
    return available;
  }

  getFilteredRooms(type, date) {
    if (type === 'all') {
      domUpdates.appendAvailableRooms(this.getRoomsAvailable(date));
    } else {
      let available = this.getRoomsAvailable(date);
      let filteredRooms = available.filter(room => {
        return room.roomType.toUpperCase() === type.toUpperCase();
      });
      domUpdates.appendAvailableRooms(filteredRooms);
      return filteredRooms;
    }
  }

  getTotalRevenue() {
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

  getPercentOccupancy() {
    let percent = +(((this.todayBookings.length / this.rooms.length) * 100).toFixed(2));
    return percent;
  }

  unbookRoom(booking) {
    let roomToUnbook = this.bookings.findIndex(reservation => {
      return JSON.stringify(Object.values(reservation)) === JSON.stringify(Object.values(booking));
    });
    this.bookings.splice(roomToUnbook, 1);
    let unbookFromGuest = this.selectedGuest.selectedBookings.findIndex(reservation => {
      return JSON.stringify(Object.values(reservation)) === JSON.stringify(Object.values(booking));
    });
    this.selectedGuest.selectedBookings.splice(unbookFromGuest);
  }

  bookRoom(id, day, rmNum) {
    let addedBooking = new Booking(id, day, rmNum)
    this.bookings.push(addedBooking);
    this.selectedGuest.selectedBookings.push(addedBooking);
  }

  createMenu() {
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
    let sortedBookings = this.bookings.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return sortedBookings.reduce((days, booking) => {
      if (!days[booking.date]) {
        days[booking.date] = 1;
      } else {
        days[booking.date] ++;
      }
      return days;
    }, {});
  }

  getMostPopularDays() {
    let dailyTotals = this.getBookingsPerDay();
    let mostBookings = Object.keys(dailyTotals).reduce((total, day) => {
      if (dailyTotals[day] > total.num) {
        total.days = [day];
        total.num = dailyTotals[day];
      } else if (dailyTotals[day] === total.num) {
        total.days.push(day);
      }
      return total;
    }, {days: [], num: 0});
    domUpdates.appendPopularDays(mostBookings);
    return mostBookings;
  }

  getFutureBookings() {
    let futureBookings = this.bookings.filter(booking => Date.parse(booking.date) >= Date.parse(this.date));
    let sortedFuture = futureBookings.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return sortedFuture.reduce((days, booking) => {
      if (!days[booking.date]) {
        days[booking.date] = 1;
      } else {
        days[booking.date] ++;
      }
      return days;
    }, {}); 
  }

  getMostAvailableDays() {
    let dailyTotals = this.getFutureBookings();
    let leastBookings = Object.keys(dailyTotals).reduce((total, day) => {
      if (dailyTotals[day] < total.num) {
        total.days = [day];
        total.num = dailyTotals[day];
      } else if (dailyTotals[day] === total.num) {
        total.days.push(day);
      } 
      return total;
    }, {days: [], num: this.bookings.length});
    domUpdates.appendMostAvailableDays(leastBookings, this.rooms);
    return leastBookings;
  }

}

export default Hotel;