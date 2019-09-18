import chai from 'chai';
const expect = chai.expect;

import Order from '../src/Order';


describe('Order', () => {
  let date, order;

  beforeEach(() => {
    date = '2019/09/22';
    order = new Order(10, date, 'Tasty Wooden Sandwich', 11.15);
  });

  it('should be a function', () => {
    expect(Order).to.be.a('function');
  });

  it('should be able to create an order', () => {
    expect(order).to.eql({
      userID: 10,
      date: "2019/09/22",
      food: "Tasty Wooden Sandwich",
      totalCost: 11.15});
  });

});