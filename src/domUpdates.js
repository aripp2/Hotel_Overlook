import $ from 'jquery';

export default {

  appendHotelInfo(revenue, available, percent) {
    $('#hotel-info').append(`
      <h4>Total Revenue Today: $${revenue}</h4>
      <h4>Number of Rooms Available Today: ${available}</h4>
      <h4>${percent}% Occupancy</h4>
    `)
  },
};