document.addEventListener('DOMContentLoaded', function(){
    let today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        monthTag =["January","February","March","April","May","June","July","August","September","October","November","December"],
        day = today.getDate(),
        days = document.getElementsByTagName('td'),
        selectedDay,
        setDate,
        daysLen = days.length;

    // options should like '2014-01-01'
    function Calendar(selector, options) {
        this.options = options;
        this.draw();
    }

    Calendar.prototype.draw  = function() {
        this.getCookie('selected_day');
        if (selectedDay){
            year = selectedDay.getFullYear();
            month = selectedDay.getMonth();
            day = selectedDay.getDate()
        }

        this.getOptions();
        this.drawDays();
        let that = this,
            pre = document.getElementsByClassName('pre-button'),
            next = document.getElementsByClassName('next-button');

        pre[0].addEventListener('click', function(){that.preMonth(); });
        next[0].addEventListener('click', function(){that.nextMonth(); });
        while(daysLen--) {
            days[daysLen].addEventListener('click', function(){that.clickDay(this); });
        }
    };

    Calendar.prototype.drawHeader = function(e) {
        let headDate = document.getElementsByClassName('head-date');

        headDate[0].innerHTML =monthTag[month] +",  " + year;
    };

    Calendar.prototype.drawSelected = function(e) {
        localStorage.setItem("taskListDate", `${year}-${month}-${e?e:day}`);
        localStorage.setItem("taskListMonth", month);
        localStorage.setItem("taskListYear", year);
        localStorage.setItem("taskListDay", e?e:day);
        let selectedDay = document.getElementsByClassName('selected-day'),
            selectedMonth = document.getElementsByClassName('selected-month');

        e?selectedDay[0].innerHTML = e : selectedDay[0].innerHTML = day;
        selectedMonth[0].innerHTML = monthTag[month] +",  " + year;
        this.date = new Date(year, month, 1);
    };

    Calendar.prototype.drawDays = function() {
        let startDay = new Date(year, month, 1).getDay(),
            nDays = new Date(year, month + 1, 0).getDate(),

            n = startDay;

        for(let k = 0; k <42; k++) {
            days[k].innerHTML = '';
            days[k].id = '';
            days[k].className = '';
        }

        for(let i  = 1; i <= nDays ; i++) {
            days[n].innerHTML = i;
            n++;
        }

        for(let j = 0; j < 42; j++) {
            if(days[j].innerHTML === ""){

                days[j].id = "disabled";

            }else if(j === day + startDay - 1){
                if((this.options && (month === setDate.getMonth()) && (year === setDate.getFullYear())) || (!this.options && (month === today.getMonth())&&(year===today.getFullYear()))){
                    this.drawHeader(day);
                    this.drawSelected(day);
                    days[j].className = "selected";
                }
            }
            if(selectedDay){
                if((j === selectedDay.getDate() + startDay - 1)&&(month === selectedDay.getMonth())&&(year === selectedDay.getFullYear())){
                    days[j].className = "selected";
                    this.drawSelected(selectedDay.getDate());
                    this.drawHeader(selectedDay.getDate());
                }
            }
        }
    }

    Calendar.prototype.clickDay = function(o) {
        let selected = document.getElementsByClassName("selected"),
            len = selected.length;
        if(len !== 0){
            selected[0].className = "";
        }
        o.className = "selected";
        selectedDay = new Date(year, month, o.innerHTML);
        this.drawSelected(o.innerHTML);
        this.setCookie('selected_day', 1);
        document.querySelector('.task-list').innerHTML = "";
    };

    Calendar.prototype.preMonth = function() {
        if(month < 1){
            month = 11;
            year = year - 1;
        }else{
            month = month - 1;
        }
        localStorage.setItem("taskListMonth", month);
        localStorage.setItem("taskListYear", year);
        this.drawHeader();
        this.drawDays();
    };

    Calendar.prototype.nextMonth = function() {
        if(month >= 11){
            month = 0;
            year =  year + 1;
        }else{
            month = month + 1;
        }
        localStorage.setItem("taskListMonth", month);
        localStorage.setItem("taskListYear", year);
        this.drawHeader();
        this.drawDays();
    };

    Calendar.prototype.getOptions = function() {
        if(this.options){
            let sets = this.options.split('-');
            setDate = new Date(sets[0], sets[1]-1, sets[2]);
            day = setDate.getDate();
            year = setDate.getFullYear();
            month = setDate.getMonth();
        }
    };

    Calendar.prototype.setCookie = function(name, expiredays){
        if(expiredays) {
            let date = new Date();
            date.setTime(date.getTime() + (expiredays*24*60*60*1000));
            let expires = "; expires=" +date.toGMTString();
            document.cookie = name + "=" + selectedDay + expires + "; path=/";
        }else{
            let expires = "";
            document.cookie = name + "=" + selectedDay + expires + "; path=/";
        }
    };

    Calendar.prototype.getCookie = function(name) {
        if(document.cookie.length){
            let arrCookie  = document.cookie.split(';'),
                nameEQ = name + "=";
            for(let i = 0, cLen = arrCookie.length; i < cLen; i++) {
                let c = arrCookie[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1,c.length);

                }
                if (c.indexOf(nameEQ) === 0) {
                    selectedDay =  new Date(c.substring(nameEQ.length, c.length));
                }
            }
        }
    };
    let calendar = new Calendar();


}, false);
