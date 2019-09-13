import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Customer from '../src/Customer';
import customers from '../src/sample-data/customers-sample-data';

describe('Customer', () => {
  let date, customer;

  beforeEach(() => {
    date = '2019/09/22';
    customer = new Customer();
  });

  it('should be a function', () => {
    expect(Customer).to.be.a('function');
  });



});