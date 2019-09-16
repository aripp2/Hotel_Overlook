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

  it('should have a menu sorted by price', () => {
    expect(hotel.menu[0]).to.eql({food: 'Rustic Soft Sandwich', price: 6.78})
  });

//describe getTodaysOrders()
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

//describe getTodaysBookings()
  it('should be able to find bookings for date', () => {
    expect(hotel.getTodaysBookings()).to.eql([
      { userID: 5, date: '2019/09/22', roomNumber: 2 },
      { userID: 8, date: '2019/09/22', roomNumber: 18 },
      { userID: 10, date: '2019/09/22', roomNumber: 4 }]);
  });

  it('should be able to get customer info by their id', () => {
    hotel.getCustomerById(10);
    expect(hotel.selectedCustomer.name).to.equal('Chyna Gulgowski');
  });

  it('should be able to add a new customer', () => {
    expect(hotel.addNewCustomer('Amy Rippeto')).to.eql({
      id: 11,
      name: 'Amy Rippeto', 
      selectedBookings: [],
      selectedOrders: []
    });
    expect(hotel.customers.length).to.equal(11);
  });

  it('should be able to get rooms available for date', () => {
    expect(hotel.getRoomsAvailable(date).length).to.equal(17);
  });

  it('should be able to get total revenue for day', () => {
    expect(hotel.getTotalRevenue(date)).to.equal(774.46);
  });

  it('should be able to get percent occupancy', () => {
    expect(hotel.getPercentOccupancy(date)).to.equal(15);
  });

  it('should be able to unbook a room', () => {
    expect(hotel.bookings.length).to.equal(20);
    hotel.unbookRoom({ userID: 4, date: "2019/09/28", roomNumber: 13});
    expect(hotel.bookings.length).to.equal(19);
  });

  it('should be able to book a room', () => {
    hotel.bookRoom(10, '2019/10/10', 2);
    expect(hotel.bookings[hotel.bookings.length - 1]).to.eql({userID: 10, date: '2019/10/10', roomNumber: 2}); 
  });

  it('should be able to order food', () => {
    hotel.orderFood(10, '2019/09/22', 'Tasty Granite Sandwich', 18.73);
    expect(hotel.orders[hotel.orders.length - 1]).to.eql({
      userID: 10,
      date: "2019/09/22",
      food: "Tasty Granite Sandwich",
      totalCost: 18.73
    });
  });


});

