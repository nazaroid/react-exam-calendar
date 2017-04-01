import 'babel-polyfill';
import CalendarStore from '../CalendarStore.js';
import { expect } from 'chai';

describe('CalendarStore', () => {
  it('Should build 35-day matrix', function() {
    const date = new Date(2017, 1);
    //when
    const matrix = CalendarStore.monthFor(date);
    //then
    const cellsAmount = matrix.rows.reduce((pr, cur) => {return pr + cur.length; }, 0);
    expect(cellsAmount).to.eql(35);
  });
});
