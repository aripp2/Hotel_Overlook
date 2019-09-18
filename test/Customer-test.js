import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Customer from '../src/Customer';
import customers from '../src/sample-data/customers-sample-data';
import bookings from '../src/sample-data/bookings-sample-data';
import orders from '../src/sample-data/orders-sample-data';

describe('Customer', () => {
  let date, customer;

  beforeEach(() => {
    date = '2019/09/22';
    customer = new Customer(11, 'Amy Rippeto', bookings, orders);
  });

  it('should be a function', () => {
    expect(Customer).to.be.a('function');
  });

  it('should be able to create a customer', () => {
    expect(customer.id).to.equal(11);
    expect(customer.name).to.equal('Amy Rippeto');
    expect(customer.selectedBookings).to.eql([]);
    expect(customer.selectedOrders).to.eql([]);
  });

});