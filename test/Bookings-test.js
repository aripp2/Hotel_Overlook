import chai from 'chai';
import spies from "chai-spies";
const expect = chai.expect;
chai.use(spies);

import Bookings from '../src/Orders';
import bookings from '../src/sample-data/bookings-sample-data';

describe('Bookings', () => {
  let date, bookings;

  beforeEach(() => {
    date = '2019/09/22';
    bookings = new Bookings();
  });

  it('should be a function', () => {
    expect(Bookings).to.be.a('function');
  });



});