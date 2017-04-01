import styles from './_Body.scss';
import React from 'react';
import Calendar from '../Calendar/Calendar';

class Logger {
    constructor(name) {
        this.name = name;
    }
    log(msg, par) {
        msg = '[' + this.name + '] ' + msg;
        msg = par ? msg + ': ' + par : msg;
        console.log(msg);
    }
}

const logger = new Logger('calendar');

export default class Body extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <h1 className={styles.header}>Exam Calendar</h1>
        <p>This is an example of Calendar, powered by Bootstrap 3, React, ES6 &amp; webpack 2.</p>
        <Calendar onDateSelected={(d) => {logger.log('selected day', d.toLocaleDateString()); }}
                  onMonthSelected={(m) => {logger.log('current month', Calendar.formatMonth(m)); }}/>
      </div>
    );
  }
}
