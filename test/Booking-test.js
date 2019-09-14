import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Booking from '../src/Booking';
import bookings from '../src/sample-data/bookings-sample-data';

describe('Booking', () => {
  let date, booking;

  beforeEach(() => {
    date = '2019/09/22';
    booking = new Booking(10, date, 22);
  });

  it('should be a function', () => {
    expect(Booking).to.be.a('function');
  });



});