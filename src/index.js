// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';
import Chart from 'chart.js';
import Hotel from '../src/Hotel';
import domUpdates from '../src/domUpdates';

import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
let date, today, hotel

date = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
today = new Date().toString().split(' ').slice(0, 4).join(' ');

let roomsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms');
let bookingsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings');
let ordersData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices');
let customersData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users');

Promise.all([roomsData, bookingsData, ordersData, customersData])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => createHotel(date, data[0].rooms, data[1].bookings, data[2].roomServices, data[3].users))
    .catch(error => console.log(error));

const createHotel = (date, rooms, bookings, roomServices, customers) => {
  hotel = new Hotel(date, rooms, bookings, roomServices, customers);
  $('#today').text(today);
  createMainTab();
  createGuestsTab();
  createRoomsTab()
  // domUpdates.appendMenu(hotel.menu);
}

const createMainTab = () => {
  hotel.getTodaysBookings();
  hotel.getTodaysOrders();
  let revenue = hotel.getTotalRevenue(date);
  let available = hotel.rooms.length - hotel.todayBookings.length;
  let percent = hotel.getPercentOccupancy(date)
  domUpdates.appendHotelInfo(revenue, available, percent);
  appendPercentChart();
}

const createGuestsTab = () => {
  domUpdates.makeGuestNames(hotel.customers);
}

const createRoomsTab = () => {
  hotel.getRoomsAvailable(date);
  hotel.getMostPopularDays();
  hotel.getMostAvailableDays();
}

const appendPercentChart = () => { 
  const percentChart = new Chart($('#occupancy'), {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Avaialble'],
      datasets: [{
        label: 'Today\'s Occupancy',
        data: [hotel.getPercentOccupancy(date), 100 - hotel.getPercentOccupancy(date)],
        backgroundColor: [
          '#494850',
          '#D8D8F6'
        ],
        // borderColor: [
        //   '#2C2C34',
        //   '#2C2C34'
        // ]
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
  
  // Show the first tab by default
  $('.tabs-content div').hide();
  $('.tabs-content div:first').show();
  $('.tabs-nav li:first').addClass('tab-active');
  
  // Change tab class and display content
  $('.tabs-nav a').on('click', function(event){
    event.preventDefault();
    $('.tabs-nav li').removeClass('tab-active');
    $(this).parent().addClass('tab-active');
    $('.tabs-content div').hide();
    $($(this).attr('href')).show();
  });

  $('#guest-search').on('change', () => {
    let id = $('#guest-search option:selected').val();
    id = parseInt(id);
    hotel.getCustomerById(id);
    
    // updateContentForSelecetedGuest(hotel.selectedCustomer)
  });

  $('#new-guest-input').on('change', () => {
    $('#add-guest-btn').prop('disabled', false);
    $('#add-guest-btn').click(() => {
      let name = $('#new-guest-input').val();
      $('#new-guest-input').val('');
      hotel.addNewCustomer(name);
      $('.guest-names').empty('option');
      $('.guest-names').append(`<option>Select a Guest...</option>`)
      domUpdates.makeGuestNames(hotel.customers);
    })
  })

  const updateContentForSelecetedGuest = (guest) => {
    // guest.selectedBookings.map(booking => {
    //   return {

    //   }
    // })
  }

});


