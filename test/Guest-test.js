import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Guest from '../src/Guest';
// import guests from '../src/sample-data/guests-sample-data';
import bookings from '../src/sample-data/bookings-sample-data';
import orders from '../src/sample-data/orders-sample-data';

describe('Guest', () => {
  let guest;

  beforeEach(() => {
    guest = new Guest(11, 'Amy Rippeto', bookings, orders);
  });

  it('should be a function', () => {
    expect(Guest).to.be.a('function');
  });

  it('should be able to create a guest', () => {
    expect(guest.id).to.equal(11);
    expect(guest.name).to.equal('Amy Rippeto');
    expect(guest.selectedBookings).to.eql([]);
    expect(guest.selectedOrders).to.eql([]);
  });

});