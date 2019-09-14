import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Order from '../src/Order';
import orders from '../src/sample-data/orders-sample-data';

describe('Order', () => {
  let date, order;

  beforeEach(() => {
    date = '2019/09/22';
    order = new Order();
  });

  it('should be a function', () => {
    expect(Order).to.be.a('function');
  });



});