import $ from 'jquery';

export default {

  reformatDate(date) {
    let fixedDate = date.split('/');
    return fixedDate[1] + '/' + fixedDate[2] + '/' + fixedDate[0];
  },

  appendHotelInfo(revenue, available, percent) {
    $('.main-info').remove();
    $('#percent').text(`${percent}%`);
    $('#hotel-info').append(`
      <h4 class="main-info">Total Revenue Today: $${revenue.toLocaleString()}</h4>
      <h4 class="main-info">${available} Rooms Still Available</h4>`);
  },

  appendTodaysBookings(bookings, guests, rooms) {
    bookings.forEach(booking => {
      let name = guests.find(guest => guest.id === booking.userID).name;
      let cost = rooms.find(room => room.number === booking.roomNumber).costPerNight;
      $('.todays-bookings').append(
        `<tr class="todays-bookings-list">
          <td>${booking.userID}</td>
          <td>${name}</td>
          <td>${booking.roomNumber}</td>
          <td>$${cost.toFixed(2).toLocaleString()}</td>
        </tr>`);
    });
  },

  appendTodaysOrders(orders, guests) {
    if (orders.length > 0) {
      $('.no-orders').remove()
    }
    orders.forEach(order => {
      let name = guests.find(guest => guest.id === order.userID).name;
      $('.todays-orders').append(
        `<tr>
          <td>${order.userID}</td>
          <td>${name}</td>
          <td>${order.food}</td>
          <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
        </tr>`);
    });
  },

  makeGuestNames(guests) {
    let sortedGuests = guests.sort((a, b) => a.name.localeCompare(b.name));
    sortedGuests.forEach(guest => {
      $('.guest-names').append(`<option value="${guest.id}"> ${guest.name}</option>`);
    });
  },

  appendSelectedGuest(guest, rooms, today) {
    $('.guest-data').remove();
    $('.guest-name').text(guest.name);
    $('.guest-selected').show();
    $('#todays-orders-tab').hide();
    this.appendGuestBookings(guest, rooms, today);
    this.appendGuestOrders(guest, today);
  },

  appendGuestTotals(bill, bookings, orders, allTimeBookings, allTimeOrders) {
    $('#guest-totals').show();
    $('#total-bill').text(`$${bill}`);
    $('#booking-total').text(`$${bookings}`);
    $('#order-total').text(`$${orders}`);
    $('#all-time-bookings').text(`$${allTimeBookings}`);
    $('#all-time-orders').text(`$${allTimeOrders}`);
  },

  appendGuestBookings(guest, rooms, today) {
    let updatedGuest = guest.selectedBookings.map(booking => {
      booking.cost = rooms.find(room => room.number === booking.roomNumber).costPerNight;
      return booking;
    });
    let sortedBookings = updatedGuest.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    sortedBookings.forEach(booking => {
      let day = this.reformatDate(booking.date);
      if (Date.parse(today) <= Date.parse(booking.date)) {
        $('.no-bookings').remove();
        $('.guest-bookings').append(
          `<tr class="guest-data">
            <td>${day}</td> 
            <td>${booking.roomNumber}</td>
            <td>$${booking.cost.toFixed(2).toLocaleString()}</td>
            <td><button id="${booking.roomNumber}"class="cancel-booking-btn ${booking.date}">Cancel</button></td>
            <td><button class="add-food-btn">Order</button></td>
          </tr>`);
      } else {
        $('.no-past').remove();
        $('.past-bookings').append(
          `<tr class="guest-data">
            <td>${day}</td> 
            <td>${booking.roomNumber}</td>
            <td>$${booking.cost.toFixed(2).toLocaleString()}</td>
          </tr>`);
      }
    });
  },

  appendGuestOrders(guest, today) {
    let sortedOrders = guest.selectedOrders.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    sortedOrders.forEach(order => {
      let day = this.reformatDate(order.date);
      if (Date.parse(today) <= Date.parse(order.date)) {
        $('.no-upcoming').remove();
        $('.guest-orders').append(
          `<tr class="guest-data">
            <td>${day}</td>
            <td>${order.food}</td>
            <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
          </tr>`);
      } else {
        $('.no-past-orders').remove();
        $('.past-orders').append(
          `<tr class="guest-data">
            <td>${day}</td>
            <td>${order.food}</td>
            <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
          </tr>`);
      }
    });
  },

  appendPopularDays(days) {
    $('.popular-day').remove();
    $('#popular-count').text(`${days.num} Bookings`);
    days.days.forEach(day => {
      let fixedDate = this.reformatDate(day);
      $('#popular-dates').append(
        `<li class="popular-day">${fixedDate}</li>`);
    });
  },

  appendMostAvailableDays(days, rooms) {
    $('least-popular').remove();
    $('#available-count').text(`${rooms.length - days.num} Unbooked Rooms`);
    days.days.forEach(day => {
      let fixedDate = this.reformatDate(day);
      $('#most-available').append(
        `<li class="least-popular">${fixedDate}</li>`);
    });
  },

  appendAvailableRooms(rooms) {
    $('.room-details').remove();
    rooms.forEach(room => {
      let type = room.roomType.split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');
      let bed = room.bedSize.charAt(0).toUpperCase() + room.bedSize.slice(1);
      $('.available-rooms').append(
        `<tr class="room-details">
          <td class="rmNum">${room.number}</td>
          <td>${type}</td>
          <td>${bed}</td>
          <td>${room.bidet}</td>
          <td>$${room.costPerNight.toFixed(2).toLocaleString()}</td>
          <td class="book guest-selected" hidden><button class="book-it" id="${room.number}">Book it!</button></td>
        </tr>`);
    });
  },

  appendMenu(menu) {
    menu.forEach(item => {
      $('.menu').append(
        `<tr>
          <td>${item.food}</td>
          <td>$${item.price.toFixed(2).toLocaleString()}</td>
          <td><button>Order</button></td>
        </tr>`);
    });
  },

};