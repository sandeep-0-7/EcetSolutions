$('body').bind('cut copy paste', function (e) {
 return false;
});

var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	//console.log(params["name"]);
	return params;
};
var params = getParams(window.location.href);
var year;
if(params["key"] === "3918A6454335A69EA25BD2B9EF5DD8B2") {
	year = params["year"];
	//console.log(year);
}

$(".username").text(localStorage.getItem("usermail"));

localStorage.setItem("present","1");
$("#btn1").css({"background":"#FF0000","color":"#fff"});

var data;
var answers = [];
var oanswers = [];
var reviews = [];
var sub, qstn, ans, prst;
var th, tm;
/* var url = "https://cors-anywhere.herokuapp.com/https://ecetsolutions.herokuapp.com/cme/pyq";
	fetch(url, {
			method: 'GET',            
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				"Accept": 'application/json',
	}})
	.then( res => res.json() )
	.then( dat => { 
		data = dat;
		//console.log(data);
		
		bindex(1);
	}); */
//console.log(data); 

var data = jdata["cme"]["pyq"];
bindex(1);

var t;
function startTime() {
	t = setInterval(() => {
			
			th = $("#hour").text();
			tm = $("#minute").text();
			
			if(th == "0" && tm == "1") {
				clearInterval(t);
				subconfirm();
				submit();
			}
			if(tm == "0") {
				$("#minute").text("59");
				$("#hour").text(th - 1);
			}
			else {
				$("#minute").text(tm - 1);
			}
			
			//console.log($("#minute").text());
		}, 1000);
}

function begin() {
	//alert("a");
	if($('#icheck').prop('checked')) {
		$("#instructions").css("display","none");
		$(".footer2").css("display","none");
		$("#mock").css("display","block");
		$(".footer").css("display","block");
		startTime();
	}
}

$("#subindicator").change(()=> {
    if($("#subindicator").val() == 1)
        bindex(1);
    else if($("#subindicator").val() == 2)
        bindex(51);
    else if($("#subindicator").val() == 3)
        bindex(76);   
});

function category(s, k) {
	if(k>=1 && k<=50) {
		sub = "maths";
		$('#subindicator').val("1");
	}
	else if(k>50 && k<=75) {
		sub = "physics";
		$('#subindicator').val("2");
		k = k - 50;
	}
	else {
		sub = "chemistry";
		$('#subindicator').val("3");
		k = k - 75;
	}
	if(s == "calc")
		return sub;
	else if(s == "qstn")
		return k;
}

var n;
function changeQ(k) {
	$('#num').text("Question "+k);
	n = k;
	k = category("qstn", k);
	
	if(typeof (data.TS[year][sub]["q"+k].qimg) != 'undefined') {
		qstn = "<img src=\"qimages/"+year+"/"+data.TS[year][sub]["q"+k].qimg+"\" alt=\"question "+k+"\" class=\"queimg\"> ";
	}
	else {
		qstn = data.TS[year][sub]["q"+k].q;
	}
	$('#qstn').html(qstn);
	$('#op1').html(data.TS[year][sub]["q"+k].op1);
	$('#op2').html(data.TS[year][sub]["q"+k].op2);
	$('#op3').html(data.TS[year][sub]["q"+k].op3);
	$('#op4').html(data.TS[year][sub]["q"+k].op4);
	//console.log((data.TS[year][sub]["q"+k].sol)[8]);
	oanswers[n] = (data.TS[year][sub]["q"+k].sol)[8];
	MathJax.typeset();
}

function addA() {
	prst = localStorage.getItem("present");
	ans = $("input[name='radio']:checked").val();
	answers[prst] = ans;
	
	
	
	if(answers[prst]) {
		if(!reviews[prst])
			$("#btn"+prst).css({"background":"#228B22","color":"#fff"});
	}
	else {
		if(!reviews[prst])
			$("#btn"+prst).css({"background":"#FF0000","color":"#fff"});
	}
}

function bindex(k) {
	changeQ(k);
	addA();
	
	//prst = localStorage.getItem("present");
	
	$("#option"+ans).prop("checked",false);
	localStorage.setItem("present",k);
	
	if(answers[k]) {
		//console.log("#option"+answers[k]);
		$("#option"+answers[k]).prop("checked",true);
	}
	else {
		if(!reviews[k])
			$("#btn"+k).css({"background":"#FF0000","color":"#fff"});
	}
	
	
	
}

function previous() {
	prst = localStorage.getItem("present");
	if(Number(prst) > 1) {
		bindex(Number(prst)-1);
	}
	else {
		addA();
		reviews[prst] = 0;
	}
}

function snext() {
	prst = localStorage.getItem("present");
	if(Number(prst) < 200) {
		bindex(Number(prst)+1);
	}
	else {
		addA();
		reviews[prst] = 0;
	}
}

function review() {
	addA();
	reviews[prst] = 1;
	if(answers[prst]) {
		//mark for review with answer
		$("#btn"+prst).css({"background":"#0000FF","color":"#fff"});
	}
	else {
		//mark for review without answer
		$("#btn"+prst).css({"background":"#9400d3","color":"#fff"});
	}
	bindex(Number(prst)+1);
}

var mscore=0, pscore=0, cscore=0;     /*---------------------------*/
function calcScore(k) {
	var k2 = category("calc", k);
	if(oanswers[k] == answers[k]) {
		if(k2 == "maths")
			mscore++;
		else if(k2 == "physics")
			pscore++;
		else if(k2 == "chemistry")
			cscore++;
	}
}

function subconfirm() {
	addA();
	var total = 100;
	var ansd=0, notansd=0, marked=0, ansdmarked=0, notvstd=0;
	for(i=1; (i<answers.length); i++) {
		//console.log(ansd);
		if(answers[i]) {
			calcScore(i);
			if(reviews[i])
				ansdmarked++;
			else
				ansd++;
		}
		else {
			if(reviews[i])
				marked++;
			else
				notansd++;
		}
		
	}
	$("#ansd").text(ansd);
	$("#notansd").text(notansd);
	$("#marked").text(marked);
	$("#ansdmarked").text(ansdmarked);
	$("#notvstd").text(total - (ansd + notansd));
	//console.log(mscore+ " "+pscore+" "+cscore);
}

//console.log(firebase);
function store() {
	var database = firebase.database();
	var refstr = (localStorage.getItem("usermail")).substring(0,(localStorage.getItem("usermail")).search(".com"));
	//console.log(refstr);
	var ref = database.ref(refstr+"/"+params["name"]);
	var score = {
		maths: mscore,
		physics: pscore,
		chemistry: cscore,
		total: mscore+pscore+cscore
	};
    //console.log(score);
	ref.push(score);
    var x = setTimeout(()=> {
        window.open("result.html","_self");
    },1000);
    
}

function submit() {
	clearInterval(t);
	console.log(answers);
	console.log(oanswers);
	//console.log(reviews);
	store();
    //window.open("result.html","_self");
	
}

window.onunload = () => {
   // Clear the local storage
   window.MyStorage.clear()
}

