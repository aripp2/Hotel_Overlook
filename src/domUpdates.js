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
      $('.todays-bookings').append(
      `<tr>
        <td>${booking.userID}</td>
        <td>${booking.guest}</td>
        <td>${booking.roomNumber}</td>
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
    // let sortedGuests = guests.sort((a , b) => a.name - b.name);
    guests.forEach(guest => {
      $('.guest-names').append(`<option value="${guest.id}"> ${guest.name}</option>`);
    });
  },
};