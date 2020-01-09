$(document).ready(function() {

	var hours = [9,17]; 
	var currentTime = 0; 
	var noon = 0; 
	var delayT = 0;
	var schedules =[];

	function updateSchedule(){
		
		let time; 

		currentTime = moment().format('LT'); 
		time = parseInt(currentTime.split(/[\s,:]+/)[0]) 

		if(currentTime.includes('PM')){
			time += 12
		}

		schedules.forEach(function(key){
			$("[timeBloc="+key.time+"]").removeClass("past present future")
			if(key.time > time){
				$("[timeBloc="+key.time+"]").addClass("future")
			}
			if(key.time < time){
				$("[timeBloc="+key.time+"]").addClass("past")
			}
			if(key.time == time){
				$("[timeBloc="+key.time+"]").addClass("present")
			}
		})

		checkTime()
	}

	function checkTime(){
		currentTime = moment().format('LT'); 
		delayT = (60 - parseInt(currentTime.split(/[\s,:]+/)[1])) * 60 * 10//00
		setTimeout(updateSchedule, delayT); 
	}
	
	function realClock(){
		console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
		$("#currentDay").text(moment().format('MMMM Do YYYY, h:mm:ss a'))
	}


	function init(){
		for(var j = 0; j < 24; j++){
			let temp = {
				time: j,
				task: '',
			}; 
			schedules.push(temp)
		}

		for(let i = hours[0]; i <= hours[1]; i++){
			let noonStr = 'AM';
			if(i <= 12){noonStr = i + 'AM';}
			if(i > 12){noonStr = i - 12 + 'PM';}

			let row = $("<div></div>").addClass("row")
			let timeBloc = $("<input></input>").attr("timeBloc",i).addClass("col-sm-10 past time-block").val('')
			let hour = $("<h3></h3>").text(noonStr).addClass("col-sm-1 hour")
			let saveBtn = $("<button></button>").attr("timeBtn",i).addClass("col-sm-1 saveBtn")


			saveBtn.click(function(){
				schedules[i].task = timeBloc.val()
				localStorage.setItem('schedules', JSON.stringify(schedules));
			})
			
			row.append(hour)
			row.append(timeBloc)
			row.append(saveBtn)
			$(".container").append(row)
		}

		var tempSchedule = JSON.parse(localStorage.getItem('schedules'));

		if(typeof(tempSchedule) != "undefined" && tempSchedule != null){

			schedules = tempSchedule
			schedules.forEach(function(key){
				$("[timeBloc="+key.time+"]").val(key.task)
			})
		}

		setInterval(realClock, 1000);
		updateSchedule()
	}

	init();

});