import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Orders from '../src/Orders';
import orders from '../src/sample-data/orders-sample-data';

describe('Order', () => {
  let date, orders;

  beforeEach(() => {
    date = '2019/09/22';
    orders = new Orders();
  });

  it('should be a function', () => {
    expect(Orders).to.be.a('function');
  });



});