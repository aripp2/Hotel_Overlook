import chai from 'chai';
const expect = chai.expect;

import Booking from '../src/Booking';

describe('Booking', () => {
  let date, booking;

  beforeEach(() => {
    date = '2019/09/22';
    booking = new Booking(10, date, 2);
  });

  it('should be a function', () => {
    expect(Booking).to.be.a('function');
  });

  it('should be able to create a booking', () => {
    expect(booking).to.eql({
      userID: 10,
      date: '2019/09/22',
      roomNumber: 2
    });
  });

});