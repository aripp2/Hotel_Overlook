import $ from 'jquery';
// $makeMoney = .toFixed(2).toLocaleString();

export default {

  reformatDate(date) {
    let fixedDate = date.split('/');
    return fixedDate[1] + '/' + fixedDate[2] + '/' + fixedDate[0];
  },

  appendHotelInfo(revenue, available, percent) {
    $('#hotel-info').append(`
      <h4>Total Revenue Today: $${revenue.toFixed(2).toLocaleString()}</h4>
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
        <td>$${cost.toFixed(2).toLocaleString()}</td>
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
        <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
      </tr>`);
    })
  },

  makeGuestNames(guests) {
    let sortedGuests = guests.sort((a , b) => a.name.localeCompare(b.name));
    sortedGuests.forEach(guest => {
      $('.guest-names').append(`<option value="${guest.id}"> ${guest.name}</option>`);
    });
  },

  appendSelectedGuest(guest, rooms, today) {
    $('.guest-data').remove();
    $('#selected-guest').text(guest.name);
    this.appendGuestBookings(guest, rooms, today);
    this.appendGuestOrders(guest, today);
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
      $('.guest-bookings').append(
      `<tr class="guest-data">
        <td>${day}</td> 
        <td>${booking.roomNumber}</td>
        <td>$${booking.cost.toFixed(2).toLocaleString()}</td>
        <td><button class="cancel-booking-btn">Cancel</button></td>
        <td><button class="change-booking-btn">Change</button></td>
        <td><button class="add-food-btn">Order</button></td>
      </tr>`);
    } else {
      $('.past-bookings').append(
        `<tr class="guest-data">
          <td>${day}</td> 
          <td>${booking.roomNumber}</td>
          <td>$${booking.cost.toFixed(2).toLocaleString()}</td>
        </tr>`)
      }
    })
  },

  appendGuestOrders(guest, today) {
    let sortedOrders = guest.selectedOrders.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    sortedOrders.forEach(order => {
      let day = this.reformatDate(order.date);
      if (Date.parse(today) <= Date.parse(order.date)) {
      $('.guest-orders').append(
      `<tr class="guest-data">
        <td>${day}</td>
        <td>${order.food}</td>
        <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
      </tr>`)
    } else {
      $('.past-orders').append(
      `<tr class="guest-data">
        <td>${day}</td>
        <td>${order.food}</td>
        <td>$${order.totalCost.toFixed(2).toLocaleString()}</td>
      </tr>`)
    }
    })
  },

  appendMenu(menu) {
    menu.forEach(item => {
      $('.menu').append(
        `<tr>
          <td>${item.food}</td>
          <td>$${item.price.toFixed(2).toLocaleString()}</td>
          <td><button>Order</button></td>
        </tr>`)
    })
  },

  appendAvailableRooms(rooms) {
    // sort by???
    rooms.forEach(room => {
      let type = room.roomType.split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');
      let bed = room.bedSize.charAt(0).toUpperCase() + room.bedSize.slice(1)
      $('.available-rooms').append(
        `<tr class="room-details">
          <td>${room.number}</td>
          <td>${type}</td>
          <td>${bed}</td>
          <td>${room.bidet}</td>
          <td>$${room.costPerNight.toFixed(2).toLocaleString()}</td>
          <td><button>Book</button></td>
        </tr>`
        )
    });
  },

  showAvailableRoomsByType(type, rooms) {
    let filteredRooms = rooms.filter(room => {
      return room.roomType.toUpperCase() === type.toUpperCase();
    });
    $('.room-details').remove();
    this.appendAvailableRooms(filteredRooms);
  },

};