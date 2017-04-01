import inGroupsOf from 'in-groups-of';

export class DayType {
    static prev(v){
        if(v){
            return v === 'prev';
        }
        return 'prev';
    }
    static next(v){
        if(v){
            return v === 'next';
        }
        return 'next';
    }
    static middle(v){
        if(v){
            return v === 'middle';
        }
        return 'middle';
    }
}

class CalendarStore {

    monthFor (date, selectedDate) {

        function isLeapYear (year) {
            return (year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0)) || (year === 0);
        }
        function daysInMonth (month, year) {
            return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        }
        function getDayOfWeek(d, m, y) {
            const startDay = 1; // Mon
            return (new Date(y, m, d).getDay() - startDay + 7) % 7;
        }
        function splitTime(d) {
            d.setHours(0, 0, 0, 0);
            return d;
        }
        function getToday() {
            return splitTime(new Date());
        }
        function clamp (month) {
            if (month > 11) {
                return 0;
            }
            if (month < 0) {
                return 11;
            }
            return month;
        }


        function createDay (ymd, selDate, type) {
            const d = new Date(ymd[0], ymd[1], ymd[2]);
            const today = getToday();

            const nonSelectableDate = new Date(-8640000000000000);
            selDate = splitTime(selDate || nonSelectableDate);

            return {
                date: d,
                selected: d.valueOf() === selDate.valueOf(),
                today: d.valueOf() === today.valueOf(),
                type: type
            };
        }
        function cellsBefore (month, year, n, selDate) {
            const cells = [];
            if (month === 0) {
                --year;
            }
            const prev = clamp(month - 1);
            let before = daysInMonth(prev, year);
            while (n--) {
                cells.push(createDay([year, prev, before--], selDate, DayType.prev()));
            }
            return cells.reverse();
        }
        function cellsMiddle(month, year, daysInMiddleMonth, selDate) {
            const cells = [];
            for (let i = 0; i < daysInMiddleMonth; ++i) {
                let day = i + 1;
                cells.push(createDay([year, month, day], selDate, DayType.middle()));
            }
            return cells;
        }
        function cellsAfter (month, year, n, selDate) {
            const cells = [];
            let day = 0;
            if (month === 11) {
                Number(Number(year));
            }
            const next = clamp(month + 1);
            while (n--) {
                cells.push(createDay([year, next, ++day], selDate, DayType.next()));
            }
            return cells;
        }
        function concatCells(month, year, selDate) {
            let cells = [];
             return (before) => {
                    return (middle) => {
                        return (after) => {
                            cells = cells.concat(cellsBefore(month, year, before, selDate));
                            cells = cells.concat(cellsMiddle(month, year, middle, selDate));
                            cells = cells.concat(cellsAfter(month, year, after, selDate));
                            return cells;
                        };
                    };
             };
        }

        this._date = date;
        this._selectedDate = selectedDate || this._selectedDate;

        const month = date.getMonth();
        const year = date.getFullYear();

        const middle = daysInMonth(month, year);
        const before = getDayOfWeek(1, month, year);

        const perRow = 7;
        const totalDaysInMatrix = perRow * Math.ceil((middle + before) / perRow);
        const after = totalDaysInMatrix - (middle + before);

        const cells = concatCells(month, year, this._selectedDate)(before)(middle)(after);
        const rows = inGroupsOf(cells, perRow);

        return {
            currentMonth: new Date(year, month, 1),
            rows: rows
        };
    }

    prevMonth() {
        var date = new Date(this._date);
        date.setMonth(date.getMonth() - 1);

        return this.monthFor(date);
    }

    nextMonth (){
        var date = new Date(this._date);
        date.setMonth(date.getMonth() + 1);
        return this.monthFor(date);
    }
}

let store = new CalendarStore();
export default store;
