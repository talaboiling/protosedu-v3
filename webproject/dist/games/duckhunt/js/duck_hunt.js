$(document).ready(function() {

	var patrons = 0;//счетчик патронов
	var points = 0;//счетчик очков
	var win;//таймАут конец игры
	var timeInt;//таймер для отсчета времени
	var time = 60;// счетчик время игры в сек.
	var winTime = Number(time + '000')// время длительности игры в млсек.
	var duckDisplay;//таймИнтервал для проверки наличия уток
	var audio  = document.getElementById('audio');

	var ducksObj = {
		duck1: {
			name:$('.duck1'),
			coordinate_y_x: [
			[85, 10, 30, 45, 10, 85, 80, 5, 10, 60, -20],
			[50, 10, 85, 30, 5, 85, 10, 70, 5, 85, 45]
			] ,
			duckFlyTimeOut: []
		},	
		duck2: {
			name: $('.duck2'),
			coordinate_y_x: [
			[85, 30, 20, 5, 50, 0, 80, 15, 50, 15, -20],
			[50, 85, 5, 60, 80, 0, 50, 70, 5, 55, 85]
			],
			duckFlyTimeOut: []
		},
		duck3: {
			name: $('.duck3'),
			coordinate_y_x: [
			[85, 0, 50, 50, 40, 0, 60, 40, 5, 55, 10],
			[50, 70, 1, 80, 30, 80, 0, 30, 75, 55, -20]
			],
			duckFlyTimeOut: []
		}
	};

	var ducksArr = [ducksObj.duck1, ducksObj.duck2, ducksObj.duck3];

	function removeClass(duck_number){
		duck_number.removeClass('duckShoot duck_fly_left duck_fly_top_right duck_fly_top_left duck_fly_right');
	};

	function animateDuck(duck_number, y, x, beforY, beforX,t) {
		duck_number.addClass('duck_fly');
		return setTimeout ( function(){
			removeClass(duck_number);
			var direction = 'duck_fly';
			if (y < beforY){
				direction = 'duck_fly_top';
			};
			if (x > beforX){
				direction = direction + '_right';
			} else {
				direction = direction + '_left';
			};
			duck_number.css({'top': y + 'vh', 'left': x + 'vw'}).addClass(direction);
		}, t);
	};

	function ducksHide (){
		for (var duckHide of ducksArr) {
			if (parseInt(duckHide.name.css('top')) < 0 || parseInt(duckHide.name.css('left')) < 0) {
				duckHide.name.removeClass('duck_fly');
			};
		};
	};
	
	//ФУНКЦИЯ НАЧАЛО ИГРЫ
	function startGame () {
		$('.dog').addClass('dog_walk');

		var timeDogWalk = Number(parseInt($('.dog').css('transition-duration')) + '000');

		setTimeout(function(){
			$('.dog').removeClass('dog_walk').addClass('dog_jump');
		}, timeDogWalk);

		setTimeout(function() {
			duckDisplay = setInterval( function () {
				ducksHide ();
				if( $('.duck1').css('display')  === 'none'
					&& $('.duck2').css('display')  === 'none' 
					&& $('.duck3').css('display')  === 'none') {
					$('.sky').css('background-color', 'hotpink');
					clearInterval(duckDisplay);
					clearTimeout(win);
					clearInterval(timeInt);
					$('.window').text('Вы проиграли!!!    ОЧКОВ:  ' + points);
					$('#start').show().text('ПЕРЕИГРАТЬ').click(function (ev) {
						location.reload();
					})
				}
			},2000);

			for (var duck of ducksArr) {
				for(var i = 0, t = 0; i < ducksArr[0].coordinate_y_x[0].length; i++) {
						duck.duckFlyTimeOut[i] = animateDuck(duck.name, duck.coordinate_y_x[0][i], duck.coordinate_y_x[1][i], duck.coordinate_y_x[0][i-1], duck.coordinate_y_x[1][i-1], t);
						t += 2000;
				};
			};
			
			$('.sky').on('click',shoot);

			timeInt = setInterval( function() {
				time = time - 1;
				$('.timer').text('00:' + time);
				if (time < 10) {
					$('.timer').text('00:0' + time);
				};
				if (time === 0) {
					clearInterval(timeInt);
				};
			},1000)
		},timeDogWalk);

		win = setTimeout( function(){
			$('.sky').hide();
			clearInterval(duckDisplay);
			$('.window').text('Вы выиграли!!!    ОЧКОВ:  ' + points);
			$('#start').show().text('ПЕРЕИГРАТЬ').click(function (ev) {
				location.reload();
			}
		)}, winTime + timeDogWalk);
	};

	$('#start').click(function (ev) {
		$(this).fadeOut();
		startGame();
	});

	//ФУНКЦИЯ СРАБАТЫВАЕТ ПРИ ВЫСТРЕЛЕ
	function shoot (ev) {
		audio.pause();
		audio.currentTime = 0;
		audio.play();
		var target = $(ev.target).attr('class');
		var shootDuck1 = $('.duck1').attr('class');
		var shootDuck2 = $('.duck2').attr('class');
		var shootDuck3 = $('.duck3').attr('class');
		var leftOnShoot1 = $('.duck1').css('left');
		var leftOnShoot2 = $('.duck2').css('left');
		var leftOnShoot3 = $('.duck3').css('left');

		$('.wrapper').css('background-color', 'hotpink');

		setTimeout(function(){
			$('.wrapper').css('background-color', '#3cbcfc');
		},100);

		// ПОПАЛИ ПО УТКЕ №1
		if (target === shootDuck1) {
			points = points + 100;
			$('.points').text(points);

			for (var timeOut of ducksArr[0].duckFlyTimeOut) {
				clearTimeout(timeOut);
			};

			removeClass(ducksArr[0].name);

			ducksArr[0].name.addClass('duckShoot');

			ducksArr[0].name.css({'top':'80vh', 'left': leftOnShoot1});

			for(var i = 0, t = 2000; i < ducksArr[0].coordinate_y_x[0].length; i++) {
				ducksArr[0].duckFlyTimeOut[i] = animateDuck(ducksArr[0].name, ducksArr[0].coordinate_y_x[0][i], ducksArr[0].coordinate_y_x[1][i], ducksArr[0].coordinate_y_x[0][i-1], ducksArr[0].coordinate_y_x[1][i-1], t);
				t += 2000;
			};

		// ПОПАЛИ ПО УТКЕ №2	
		} else if (target === shootDuck2){
			points = points + 100;
			$('.points').text(points);

			for (var timeOut of ducksArr[1].duckFlyTimeOut) {
				clearTimeout(timeOut);
			};

			removeClass(ducksArr[1].name);

			ducksArr[1].name.addClass('duckShoot');

			ducksArr[1].name.css({'top':'80vh', 'left': leftOnShoot2});

			for(var i = 0, t = 2000; i < ducksArr[1].coordinate_y_x[0].length; i++) {
				ducksArr[1].duckFlyTimeOut[i] = animateDuck(ducksArr[1].name, ducksArr[1].coordinate_y_x[0][i], ducksArr[1].coordinate_y_x[1][i], ducksArr[1].coordinate_y_x[0][i-1], ducksArr[1].coordinate_y_x[1][i-1], t);
				t += 2000;
			};

		// ПОПАЛИ ПО УТКЕ №3	
		} else if (target === shootDuck3){
			points = points + 100;
			$('.points').text(points);

			for (var timeOut of ducksArr[2].duckFlyTimeOut) {
				clearTimeout(timeOut);
			};

			removeClass(ducksArr[2].name);

			ducksArr[2].name.addClass('duckShoot');

			ducksArr[2].name.css({'top':'80vh', 'left': leftOnShoot3});

			for(var i = 0, t = 2000; i < ducksArr[2].coordinate_y_x[0].length; i++) {
				ducksArr[2].duckFlyTimeOut[i] = animateDuck(ducksArr[2].name, ducksArr[2].coordinate_y_x[0][i], ducksArr[2].coordinate_y_x[1][i], ducksArr[2].coordinate_y_x[0][i-1], ducksArr[2].coordinate_y_x[1][i-1], t);
				t += 2000;
			};

		//НЕ ПОПАЛИ
		} else {
			patrons = patrons + 1;

			if (patrons <= 10) {
				var divPatronI = '.patron' + patrons;
				$(divPatronI).css({'display' : 'none'});
			};

			if ($('.patron10').css('display') === 'none') {
				for (var duck of ducksArr) {

					for (var timeOut of duck.duckFlyTimeOut) {
						clearTimeout(timeOut);
					};

					animateDuck(duck.name, duck.coordinate_y_x[0][10], duck.coordinate_y_x[1][10], duck.coordinate_y_x[0][9], duck.coordinate_y_x[1][9],0);
				};

				clearInterval(timeInt);

				$('.window').text('Патроны закончились!!!    ОЧКОВ:  ' + points);

				setTimeout( function() {
					$('.sky').css('display', 'none');
					$('.wrapper').css('background-color', 'hotpink');
					clearInterval(duckDisplay);
					clearTimeout(win);							
				}, 1500);

				$('.sky').css('background-color', 'hotpink');
				$('#start').show().text('ПЕРЕИГРАТЬ').click(function (ev) {
					location.reload();
				});

			};
		}     
	};
});