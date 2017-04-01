import b from 'bootstrap/dist/css/bootstrap.css';
import c from './calendar.css';
import React from 'react';
import { DayType } from './CalendarStore';
import CalendarStore from './CalendarStore';

function getState(monthMatrix) {
  return {
    monthMatrix: monthMatrix
  };
}

export default class Calendar extends React.Component {

    static defaultProps = {
      onDateSelected: () => {},
      onMonthSelected: () => {}
    };

    static propTypes = {
        onDateSelected: React.PropTypes.func
    };


    static formatMonth(date) {
        return date.toLocaleString(undefined, { month: 'long'}) + ' ' + date.getFullYear();
    }

    prev() {
        const state = getState(CalendarStore.prevMonth());
        this.setState(state);

        this.props.onMonthSelected(state.monthMatrix.currentMonth);
    }
    next() {
        const state = getState(CalendarStore.nextMonth());
        this.setState(state);
        this.props.onMonthSelected(state.monthMatrix.currentMonth);
    }
    selectDate (date) {
        const state = getState(CalendarStore.monthFor(this.state.monthMatrix.currentMonth, date));
        this.setState(state);
        this.props.onDateSelected( date);
    }

    componentWillMount() {
        const state = getState(CalendarStore.monthFor(new Date()));
        this.setState(state);
    }

    render() {

        const self = this;

        function matrix(monthMatrix){
            return monthMatrix.rows.map(row => {

                return (
                    <tr>
                        {
                            row.map((dayCell)=> {
                                function mapClasses(cell) {
                                    const classes = [c.day];
                                    if(DayType.prev(cell.type)){
                                        classes.push(c.old);
                                    }
                                    else if(DayType.next(cell.type)){
                                        classes.push(c.new);
                                    }
                                    if(cell.selected) {
                                        classes.push(c.active);
                                    }
                                    if(cell.today) {
                                        classes.push(c.today);
                                    }
                                    return classes;
                                }

                                const classes = mapClasses(dayCell);

                                return (
                                    <td className={classes.join(' ')}
                                    onClick={()=>{ self.selectDate(dayCell.date); }}>{dayCell.date.getDate()}</td>
                                    );
                            })
                        }
                    </tr>
                    );
            });
        }
        function monthNav() {
            return (<tr>
                        <th onClick={() => self.prev()} className={c.prev} data-action='previous'>
                            <span className={[b.glyphicon, b['glyphicon-chevron-left']].join(' ')} />
                        </th>
                        <th className={c['picker-switch']}
                            colSpan='5'>{Calendar.formatMonth(self.state.monthMatrix.currentMonth)}</th>
                        <th onClick={() => self.next()} className={c.next} data-action='next'>
                            <span className={[b.glyphicon, b['glyphicon-chevron-right']].join(' ')} />
                        </th>
                    </tr>);
        }
        function weekDays() {
            return (<tr>
                        <th className='dow'>пн</th>
                        <th className='dow'>вт</th>
                        <th className='dow'>ср</th>
                        <th className='dow'>чт</th>
                        <th className='dow'>пт</th>
                        <th className='dow'>сб</th>
                        <th className='dow'>вс</th>
                    </tr>);
        }

        return (
            <div className={[c.datepicker].join(' ')}>
                <table className={b['table-condensed']}>
                    <thead>
                        { (monthNav()) }
                        { (weekDays()) }
                    </thead>
                    <tbody>
                        { (matrix(this.state.monthMatrix)) }
                    </tbody>
                </table>
            </div>
        );
    }
}
