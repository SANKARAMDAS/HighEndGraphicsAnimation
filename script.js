console.clear();
gsap.set("#demo", {autoAlpha:1, xPercent:-50, yPercent:-50});
gsap.set("#endPaths, .buttonCircle", {autoAlpha:0});
gsap.set("#speedLines line, #carBody", {drawSVG:0});
gsap.set("#underline", {drawSVG:"0% 74%"});

const master = gsap.timeline({paused:true, onComplete:letsMotor});
const morph = gsap.timeline();
const drive = gsap.timeline({defaults:{duration: 1, ease:"none"}, repeat:-1, paused:true});
const speed = gsap.timeline({paused:true});
const startPaths = gsap.utils.toArray("#startPaths path"); 
const endPaths = gsap.utils.toArray("#endPaths path"); 
const speedLines = gsap.utils.toArray("#speedLines line"); 
const delayArray = [0.1, 0.4, 0.2, 0, 0.3, 0.2];
const action = document.querySelector("#start");

startPaths.forEach((path, i) => {
  let tween = gsap.to(startPaths[i], {duration: 0.4, morphSVG:endPaths[i], ease:"back.inOut(1)"});
  morph.add(tween, i*0.07);
});

speedLines.forEach((line, i) => {
  let tl = gsap.timeline({defaults:{ease:"none"},repeat:-1, delay:delayArray[i]});
	tl.to(line, {duration: 0.2, drawSVG:"0% 10%"});
	tl.to(line, {duration: 0.6, drawSVG:"90% 100%"});
	tl.to(line, {duration: 0.2, drawSVG:"100% 100%"});	
	speed.add(tl, 0);
});

// infinite rotating wheels timeline
drive.to("#frontTire", {rotation:-360, svgOrigin:"362 594.5"});
drive.to("#backTire", {rotation:-360, svgOrigin:"1258 594.5"}, 0);


// morph the button and move the pieces to the wheel positions
function removeButton() {
	let tl = gsap.timeline();
	tl.set(".buttonText", {autoAlpha:0, immediateRender:false});
	tl.to("#button", {duration: 0.4, attr:{width:600, x:500, height:60, y:390}, autoAlpha:1, ease:"power3"});
	tl.to("#button", {duration: 0.25, attr:{width:80, x:760, height:80, y:380}, ease:"power2.inOut"});
	tl.set("#button", {autoAlpha:0});
	tl.set(".buttonCircle", {autoAlpha:1});
	tl.to(".buttonCircle", {duration: 0.4, attr:{cy:594.5}, opacity:0.75, ease:"power2.in"});
	tl.add("moveCircles");
	tl.to("#backCircle", {duration: 0.6, attr:{cx:1258}, ease:"power3"}, "moveCircles");
	tl.to("#frontCircle", {duration: 0.6, attr:{cx:362}, ease:"power3"}, "moveCircles");
	tl.to(".buttonCircle", {duration: 0.6, attr:{r:0}, ease:"back.in(5)"});
	return tl;
}

// animate the tires into view
function drawTires() {
	let tl = gsap.timeline();
	tl.from(".innerTire", {duration: 0.4, attr:{r:0}, ease:"back.out(2)"});
  tl.from(".outerTire", {duration: 0.5, attr:{r:0}, ease:"back.out(4)"},"-=0.15");
  tl.from(".hub", {duration: 0.4, attr:{r:0}, ease:"back.out(5)"}, "-=0.15" );
	tl.from("#wheels rect", {duration: 0.35, attr:{height:0}, ease:"power4.inOut"}, "-=0.25");
	return tl;
}

// line between initial text blocks draws the car top outline
function drawCar() {
	let tl = gsap.timeline();
	tl.to("#underline", {duration: 0.75, drawSVG:"74% 100%", ease:"power4.in"});
	tl.add("lineMeetup");
	tl.to("#underline", {duration: 0.32, drawSVG:"100% 100%", ease:"none"}, "lineMeetup");
	tl.to("#carBody", {duration: 1.5, drawSVG:true, ease:"power2"}, "lineMeetup");
	tl.to("#carBody", {duration: 0.4, attr:{fill:"white"}, ease:"none"});
	tl.to("#road", {duration: 0.4, attr:{x:0, width:1600, ease:"power3"}}, "-=0.25" );
	return tl;
}

// fire up the rotating tires and speed lines timelines
// timeScale is animated from 0 to 4 to simulate acceleration 
function letsMotor() {
	speed.play().timeScale(0);
	drive.play().timeScale(0);
	gsap.from("#speedLines", 5, {opacity:0, ease:"none"});
	gsap.to([speed, drive], 5, {timeScale:4, ease:"none"});
}

//create master timeline
master.add( removeButton() );
master.add( drawTires() );
master.add( morph );
master.add( drawCar(), "-=0.2" );

// click to make it go vroom vroom
function makeItHappen() {
	master.play();
}

action.addEventListener("click", makeItHappen);