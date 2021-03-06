import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Hotel from '../src/Hotel';
import rooms from '../src/sample-data/rooms-sample-data';
import bookings from '../src/sample-data/bookings-sample-data';
import orders from '../src/sample-data/orders-sample-data';
import guests from '../src/sample-data/guests-sample-data';
import domUpdates from '../src/domUpdates';

chai.spy.on(domUpdates, 
  ['appendTodaysOrders',
    'appendTodaysBookings',
    'appendAvailableRooms',
    'appendPopularDays',
    'appendMostAvailableDays'], () => {});

describe('Hotel', () => {
  let date, hotel;

  beforeEach(() => {
    date = '2019/09/22';
    hotel = new Hotel(date, rooms, bookings, orders, guests);
  });

  it('should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('should have a menu sorted by price', () => {
    expect(hotel.menu[0]).to.eql({food: 'Rustic Soft Sandwich', price: 6.78})
  });

  it('should be able to find orders for date', () => {
    hotel.getTodaysOrders()
    expect(hotel.todayOrders).to.eql([
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
      }]);
    expect(domUpdates.appendTodaysOrders).to.have.been.called(1);
  });

  it('should be able to find bookings for date', () => {
    hotel.getTodaysBookings();
    expect(hotel.todayBookings).to.eql([
      { userID: 5, date: '2019/09/22', roomNumber: 2 },
      { userID: 8, date: '2019/09/22', roomNumber: 18 },
      { userID: 10, date: '2019/09/22', roomNumber: 4 }]);
    expect(domUpdates.appendTodaysBookings).to.have.been.called(1);
  });

  it('should be able to get guest info by their id', () => {
    hotel.getGuestById(10);
    expect(hotel.selectedGuest.name).to.equal('Chyna Gulgowski');
  });

  it('should be able to add a new guest', () => {
    hotel.addNewGuest('Amy Rippeto');
    expect(hotel.selectedGuest).to.eql({
      id: 11,
      name: 'Amy Rippeto', 
      selectedBookings: [],
      selectedOrders: []
    });
    expect(hotel.guests.length).to.equal(11);
  });

  it('should be able to calculate bookings bill', () => {
    expect(hotel.getGuestBookingsTotalToday(10, date)).to.equal(177.03);
  });

  it('should be able to calculate orders bill', () => {
    expect(hotel.getGuestOrdersTotalToday(10, date)).to.equal(22.45);
  });

  it('should be able to calculate total bill', () => {
    expect(hotel.getGuestTotalBillToday(10, date)).to.equal(199.48);
  });

  it('should be able to calculate all time bookings total for guest', () => {
    expect(hotel.getGuestAllTimeBookingsTotal(10)).to.equal(732.8);
  });

  it('should be able to calculate all time orders total for guest', () => {
    expect(hotel.getGuestAllTimeOrdersTotal(10)).to.equal(52.43);
  });

  it('should be able to get rooms available for date', () => {
    hotel.getTodaysBookings();
    expect(hotel.getRoomsAvailable(date).length).to.equal(17);
  });

  it('should be able to filter rooms by type', () => {
    expect(hotel.getFilteredRooms('suite', date).length).to.equal(5);
    expect(domUpdates.appendAvailableRooms).to.have.been.called(1);
  });

  it('should be able to get total revenue for day', () => {
    hotel.getTodaysBookings();
    hotel.getTodaysOrders();
    expect(hotel.getTotalRevenue(date)).to.equal(774.46);
  });

  it('should be able to get percent occupancy', () => {
    hotel.getTodaysBookings();
    expect(hotel.getPercentOccupancy(date)).to.equal(15);
  });

  it('should be able to unbook a room', () => {
    hotel.getGuestById(4);
    expect(hotel.bookings.length).to.equal(20);
    hotel.unbookRoom({ userID: 4, date: "2019/10/18", roomNumber: 13});
    expect(hotel.bookings.length).to.equal(19);
  });

  it('should be able to book a room', () => {
    hotel.getGuestById(10);
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

  it('should be able to get total bookings per day', () => {
    expect(hotel.getBookingsPerDay()).to.eql({
      "2019/08/27": 6,
      "2019/09/22": 3,
      "2019/10/01": 6,
      "2019/10/05": 2,
      "2019/10/18": 2
    })
  });

  it('should find the most popular booking day', () => {
    expect(hotel.getMostPopularDays()).to.eql({days: ["2019/08/27", "2019/10/01"], num: 6});
    expect(domUpdates.appendPopularDays).to.have.been.called(1);
  });

  it('should find the day with most rooms available', () => {
    expect(hotel.getMostAvailableDays()).to.eql({days: ["2019/10/05", "2019/10/18"], num: 2});
    expect(domUpdates.appendMostAvailableDays).to.have.been.called(1);
  });


});

