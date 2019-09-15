// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';
import Hotel from '../src/Hotel';
import domUpdates from '../src/domUpdates';

import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
let date, today, hotel, roomsData, bookingsData, ordersData, customersData

date = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
today = new Date().toString().split(' ').slice(0, 4).join(' ');

roomsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms');
bookingsData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings');
ordersData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices');
customersData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users');

Promise.all([roomsData, bookingsData, ordersData, customersData])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => createHotel(date, data[0].rooms, data[1].bookings, data[2].roomServices, data[3].users))
    .catch(error => console.log(error));


const createHotel = (date, rooms, bookings, roomServices, customers) => {
  hotel = new Hotel(date, rooms, bookings, roomServices, customers);
  $('#today').text(today);
  createMain();
}

const createMain = () => {
  let revenue = hotel.getTotalRevenue(date);
  let available = hotel.rooms.length - hotel.getTodaysBookings(date).length;
  let percent = hotel.getPercentOccupancy(date)
  domUpdates.appendHotelInfo(revenue, available, percent);

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

});


