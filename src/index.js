import $ from 'jquery';
import Chart from 'chart.js';
import Hotel from '../src/Hotel';
import domUpdates from '../src/domUpdates';

import './css/base.scss';

let date, today, hotel;

date = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
today = new Date().toString().split(' ').slice(0, 4).join(' ');

let roomsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms');
let bookingsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings');
let ordersData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices');
let guestsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users');

Promise.all([roomsData, bookingsData, ordersData, guestsData])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => createHotel(date, data[0].rooms, data[1].bookings, data[2].roomServices, data[3].users))
  .catch(error => console.log(error));

const createHotel = (date, rooms, bookings, roomServices, guests) => {
  hotel = new Hotel(date, rooms, bookings, roomServices, guests);
  $('#today').text(today);
  createMainTab();
  createGuestsTab();
  createRoomsTab()
  domUpdates.appendMenu(hotel.menu);
};

const createMainTab = () => {
  hotel.getTodaysBookings();
  hotel.getTodaysOrders();
  let revenue = hotel.getTotalRevenue();
  let available = hotel.rooms.length - hotel.todayBookings.length;
  let percent = hotel.getPercentOccupancy();
  domUpdates.appendHotelInfo(revenue, available, percent);
  appendPercentChart();
};

const createGuestsTab = () => {
  domUpdates.makeGuestNames(hotel.guests);
};

const createRoomsTab = () => {
  hotel.getFilteredRooms('all', date);
  hotel.getMostPopularDays();
  hotel.getMostAvailableDays();
}

const appendPercentChart = () => { 
  new Chart($('#occupancy'), {
    type: 'doughnut',
    data: {
      labels: ['% Occupied', '% Avaialble'],
      datasets: [{
        label: 'Today\'s Occupancy',
        data: [hotel.getPercentOccupancy(), 100 - hotel.getPercentOccupancy()],
        backgroundColor: [
          '#494850',
          '#D8D8F6'
        ]
      }]
    },
    options: {
      cutoutPercentage: 60,
      responsive: false
    }
  })
}

$(document).ready(() => {
  // $('#page').hide();
  $('.guest-selected').hide();
  $('.tabs-content div').hide();
  $('.tabs-content div:first').show();
  $('.tabs-nav li:first').addClass('tab-active');
  
  // Change tab class and display content
  $('.tabs-nav a').on('click', function(event) {
    event.preventDefault();
    $('.tabs-nav li').removeClass('tab-active');
    $(this).parent().addClass('tab-active');
    $('.tabs-content div').hide();
    $($(this).attr('href')).show();
  });

  $('#guest-search').on('change', () => {
    let id = $('#guest-search option:selected').val();
    id = parseInt(id);
    hotel.getGuestById(id);
    updateGuest(hotel.selectedGuest.id);
    // domUpdates.appendSelectedGuest(hotel.selectedGuest, hotel.rooms, date);
  });

  $('#new-guest-input').on('change', () => {
    $('#add-guest-btn').prop('disabled', false);
    $('#add-guest-btn').click(() => {
      let name = $('#new-guest-input').val();
      $('#new-guest-input').val('');
      hotel.addNewGuest(name);
      $('.guest-names').empty('option');
      $('.guest-names').append(`<option>Select a Guest...</option>`)
      domUpdates.makeGuestNames(hotel.guests);
      updateGuest(hotel.selectedGuest.id);
      // domUpdates.appendSelectedGuest(hotel.selectedGuest, hotel.rooms, date);
    });
  });

  $('#room-type').on('change', () => {
    let rmType = $('#room-type option:selected').val();
    let searchDate = $('#find-available').val().replace(/-/g, "/");
    $('#filter-rooms').click((e) => {
      e.preventDefault();
      hotel.getFilteredRooms(rmType, searchDate);
    });
  });

  $('#rooms').click((e) => {
    if (e.target.classList.contains('book-it')) {
      let room = parseInt(e.target.id);
      let id = hotel.selectedGuest.id;
      let searchDate = $('#find-available').val().replace(/-/g, "/");
      hotel.bookRoom(id, searchDate, room);
      updateAllTabs();
    }
  });

  $('#guest').click((e) => {
    if (e.target.classList.contains('cancel-booking-btn')) {
      let room = parseInt(e.target.id);
      let id = hotel.selectedGuest.id;
      let searchDate = e.target.classList[1];
      let bookingToCancel = {
        userID: id,
        date: searchDate,
        roomNumber: room
      };
      hotel.unbookRoom(bookingToCancel);
      //update main
      updateAllTabs();
    }
  });

  const updateAllTabs = () => {
    $('.todays-bookings-list').remove();
    createMainTab();
    hotel.getFilteredRooms('all', date);
    updateGuest(hotel.selectedGuest.id);
      // domUpdates.appendSelectedGuest(hotel.selectedGuest, hotel.rooms, date);
  };

  const updateGuest = (id) => {
    domUpdates.appendSelectedGuest(hotel.selectedGuest, hotel.rooms, date);
    let bookingsTotal = hotel.getGuestBookingsTotalToday(id, date);
    let ordersTotal = hotel.getGuestOrdersTotalToday(id, date);
    let bill = hotel.getGuestTotalBillToday(id, date);
    let allTimeBookingTotal = hotel.getGuestAllTimeBookingsTotal(id);
    let allTimeOrderTotal = hotel.getGuestAllTimeOrdersTotal(id);
    domUpdates.appendGuestTotals(bill, bookingsTotal, ordersTotal, allTimeBookingTotal, allTimeOrderTotal);
  };

});


