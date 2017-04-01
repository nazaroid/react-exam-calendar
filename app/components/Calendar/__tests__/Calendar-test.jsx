import React from 'react/addons';
import { expect } from 'chai';

import Calendar from '../Calendar.jsx';
import c from '../calendar.css';

describe('Calendar', () => {

  let { TestUtils } = React.addons;

  describe('Rendering', () => {

    let calendar = TestUtils.renderIntoDocument(
      <Calendar />
    );
    let calendarElem = React.findDOMNode(calendar);
    let days = calendarElem.querySelectorAll('.' + c.day);

    it('Calendar should contain 35 days', () => {
      expect(days.length).to.equal(35);
    });
  });
});
