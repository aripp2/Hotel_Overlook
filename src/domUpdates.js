import $ from 'jquery';

export default {

  appendHotelInfo(revenue, available, percent) {
    $('#hotel-info').append(`
      <h4>Total Revenue Today: $${revenue}</h4>
      <h4>Number of Rooms Available Today: ${available}</h4>
      <h4>${percent}% Occupancy</h4>
    `)
  },

  appendTodaysBookings(bookings) {
    bookings.forEach(booking => {
      $('.todays-bookings, .todays-bookings-tab').append(
      `<tr>
        <td>${booking.userID}</td>
        <td>${booking.guest}</td>
        <td>${booking.roomNumber}</td>
        <td>${booking.cost}</td>
        <td><button class="cancel-booking-btn">Cancel</button></td>
        <td><button class="change-booking-btn">Change</button></td>
        <td><button class="add-food-btn">Order</button></td>
      </tr>`);
    })
  },

  appendTodaysOrders(orders) {
    orders.forEach(order => {
      $('.todays-orders').append(
      `<tr>
        <td>${order.userID}</td>
        <td>${order.guest}</td>
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

  appendSelectedGuest(guest) {
    $('#selected-guest').text(guest.name);
    this.appendGuestBookings(guest);
    this.appendGuestOrders(guest);
  },

  appendGuestBookings(guest) {
    $('.todays-bookings-tab').hide();
    $('.guest-bookings').remove();
    if (guest.selectedBookings === null) {
      $('.guest-bookings').append(
        `<div>
          <h6>${guest.name} does not have any Bookings</h6>
          <button>Add a Booking</button>
        </div>`
        )
    } else {
      guest.selectedBookings.forEach(booking => {
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
    }
  },

  appendGuestOrders(guest) {
    $('.todays-orders-tab').hide();
    console.log(guest.selectedOrders)
    $('.guest-orders').empty();
    if (guest.selectedOrders === null) {
      $('.guest-orders').append(
        `<div>
          <h6>${guest.name} does not have any Room Service Orders</h6>
          <button>Add Room Service Order</button>
        </div>`
        )
    } else {
      guest.selectedOrders.forEach(order => {
        $('.guest-orders').append(
        `<tr>
          <td>${order.date}</td>
          <td>${order.food}</td>
          <td>$${order.totalCost}</td>
        </tr>`)
      })
    }
  },


};