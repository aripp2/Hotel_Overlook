import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Hotel from '../src/Hotel';
import rooms from '../src/sample-data/rooms-sample-data';
import bookings from '../src/sample-data/bookings-sample-data';
import orders from '../src/sample-data/orders-sample-data';
import customers from '../src/sample-data/customers-sample-data';


describe('Hotel', () => {
  let date, hotel;

  beforeEach(() => {
    date = '2019/09/22';
    hotel = new Hotel(date, rooms, bookings, orders, customers);
  });

  it('should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('should be able to find orders for date', () => {
    expect(hotel.getTodaysOrders()).to.eql([
      {
        userID: 5,
        date: '2019/09/22',
        food: 'Rustic Concrete Sandwich',
        totalCost: 14.9
      },
      {
        userID: 10,
        date: '2019/09/22',
        food: 'Handcrafted Rubber Sandwich',
        totalCost: 22.45
      }])
  });

  it('should be able to find bookings for date', () => {
    expect(hotel.getTodaysBookings()).to.eql([
      { userID: 8, date: '2019/09/22', roomNumber: 18 },
      { userID: 10, date: '2019/09/22', roomNumber: 4 }]);
  });

  it('should be able to get customer info by their id', () => {
    expect(hotel.getCustomerById(10).name).to.equal('Chyna Gulgowski');
  });

  it('should be able to add a new customer', () => {
    expect(hotel.addNewCustomer('Amy Rippeto')).to.eql({
      id: 11,
      name: 'Amy Rippeto', 
      selectedBookings: [],
      selectedOrders: []
    })
  })

});

