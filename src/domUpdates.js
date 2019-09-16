import $ from 'jquery';

export default {

  appendHotelInfo(revenue, available, percent) {
    $('#hotel-info').append(`
      <h4>Total Revenue Today: $${revenue}</h4>
      <h4>Number of Rooms Available Today: ${available}</h4>
      <h4>${percent}% Occupancy</h4>
    `)
  },

  appendTodaysBookings(bookings, guests, rooms) {
    bookings.forEach(booking => {
      let name = guests.find(guest => guest.id === booking.userID).name;
      let cost = rooms.find(room => room.number === booking.roomNumber).costPerNight;
      $('.todays-bookings').append(
      `<tr>
        <td>${booking.userID}</td>
        <td>${name}</td>
        <td>${booking.roomNumber}</td>
        <td>${cost}</td>
      </tr>`);
    })
  },

  appendTodaysOrders(orders, guests) {
    orders.forEach(order => {
      let name = guests.find(guest => guest.id === order.userID).name;
      $('.todays-orders').append(
      `<tr>
        <td>${order.userID}</td>
        <td>${name}</td>
        <td>${order.food}</td>
        <td>$${order.totalCost}</td>
      </tr>`);
    })
  },

  makeGuestNames(guests) {
    let sortedGuests = guests.sort((a , b) => a.name.localeCompare(b.name));
    sortedGuests.forEach(guest => {
      $('.guest-names').append(`<option value="${guest.id}"> ${guest.name}</option>`);
    });
  },

  appendSelectedGuest(guest, rooms) {
    $('#selected-guest').text(guest.name);
    this.appendGuestBookings(guest, rooms);
    this.appendGuestOrders(guest);
  },

  appendGuestBookings(guest, rooms) {
    let updatedGuest = guest.selectedBookings.map(booking => {
        booking.cost = rooms.find(room => room.number === booking.roomNumber).costPerNight;
        return booking;
    });
    updatedGuest.forEach(booking => {
      $('.guest-bookings').append(
      `<tr>
        <td>${booking.date}</td> 
        <td>${booking.roomNumber}</td>
        <td>${booking.cost}</td>
        <td><button class="cancel-booking-btn">Cancel</button></td>
        <td><button class="change-booking-btn">Change</button></td>
        <td><button class="add-food-btn">Order</button></td>
      </tr>`);
    })
  },

  appendGuestOrders(guest) {
    guest.selectedOrders.forEach(order => {
      $('.guest-orders').append(
      `<tr>
        <td>${order.date}</td>
        <td>${order.food}</td>
        <td>$${order.totalCost}</td>
      </tr>`)
    })
  },

  appendMenu(menu) {
    menu.forEach(item => {
      $('.menu').append(
        `<tr>
          <td>${item.food}</td>
          <td>${item.price}</td>
          <td><button>Order</button></td>
        </tr>`)
    })
  },


};