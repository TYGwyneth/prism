var Attraction,Behaviour,Collision,ConstantForce,EdgeBounce,EdgeWrap,Euler,ImprovedEuler,Integrator,Particle,Physics,Random,Spring,Vector,Verlet,Wander,namespace,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};namespace=function(id){var path,root,_i,_len,_ref,_ref1,_results;root=self,_ref=id.split("."),_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++)path=_ref[_i],_results.push(root=(_ref1=root[path])!=null?_ref1:root[path]={});return _results},function(){var time,vendor,vendors,_i,_len;time=0,vendors=["ms","moz","webkit","o"];for(_i=0,_len=vendors.length;_i<_len;_i++){vendor=vendors[_i];if(!!window.requestAnimationFrame)continue;window.requestAnimationFrame=window[vendor+"RequestAnimationFrame"],window.cancelRequestAnimationFrame=window[vendor+"CancelRequestAnimationFrame"]}window.requestAnimationFrame||(window.requestAnimationFrame=function(callback,element){var delta,now,old;return now=(new Date).getTime(),delta=Math.max(0,16-(now-old)),setTimeout(function(){return callback(time+delta)},delta),old=now+delta});if(!window.cancelAnimationFrame)return window.cancelAnimationFrame=function(id){return clearTimeout(id)}}(),Random=function(min,max){return max==null&&(max=min,min=0),min+Math.random()*(max-min)},Random.int=function(min,max){return max==null&&(max=min,min=0),Math.floor(min+Math.random()*(max-min))},Random.sign=function(prob){return prob==null&&(prob=.5),Math.random()<prob?1:-1},Random.bool=function(prob){return prob==null&&(prob=.5),Math.random()<prob},Random.item=function(list){return list[Math.floor(Math.random()*list.length)]},Vector=function(){function Vector(x,y){this.x=x!=null?x:0,this.y=y!=null?y:0}return Vector.add=function(v1,v2){return new Vector(v1.x+v2.x,v1.y+v2.y)},Vector.sub=function(v1,v2){return new Vector(v1.x-v2.x,v1.y-v2.y)},Vector.project=function(v1,v2){return v1.clone().scale(v1.dot(v2)/v1.magSq())},Vector.prototype.set=function(x,y){return this.x=x,this.y=y,this},Vector.prototype.add=function(v){return this.x+=v.x,this.y+=v.y,this},Vector.prototype.sub=function(v){return this.x-=v.x,this.y-=v.y,this},Vector.prototype.scale=function(f){return this.x*=f,this.y*=f,this},Vector.prototype.dot=function(v){return this.x*v.x+this.y*v.y},Vector.prototype.cross=function(v){return this.x*v.y-this.y*v.x},Vector.prototype.mag=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},Vector.prototype.magSq=function(){return this.x*this.x+this.y*this.y},Vector.prototype.dist=function(v){var dx,dy;return dx=v.x-this.x,dy=v.y-this.y,Math.sqrt(dx*dx+dy*dy)},Vector.prototype.distSq=function(v){var dx,dy;return dx=v.x-this.x,dy=v.y-this.y,dx*dx+dy*dy},Vector.prototype.norm=function(){var m;return m=Math.sqrt(this.x*this.x+this.y*this.y),this.x/=m,this.y/=m,this},Vector.prototype.limit=function(l){var m,mSq;mSq=this.x*this.x+this.y*this.y;if(mSq>l*l)return m=Math.sqrt(mSq),this.x/=m,this.y/=m,this.x*=l,this.y*=l,this},Vector.prototype.copy=function(v){return this.x=v.x,this.y=v.y,this},Vector.prototype.clone=function(){return new Vector(this.x,this.y)},Vector.prototype.clear=function(){return this.x=0,this.y=0,this},Vector}(),Particle=function(){function Particle(mass){this.mass=mass!=null?mass:1,this.id="p"+Particle.GUID++,this.setMass(this.mass),this.setRadius(1),this.fixed=!1,this.behaviours=[],this.pos=new Vector,this.vel=new Vector,this.acc=new Vector,this.old={pos:new Vector,vel:new Vector,acc:new Vector}}return Particle.GUID=0,Particle.prototype.moveTo=function(pos){return this.pos.copy(pos),this.old.pos.copy(pos)},Particle.prototype.setMass=function(mass){return this.mass=mass!=null?mass:1,this.massInv=1/this.mass},Particle.prototype.setRadius=function(radius){return this.radius=radius!=null?radius:1,this.radiusSq=this.radius*this.radius},Particle.prototype.update=function(dt,index){var behaviour,_i,_len,_ref,_results;if(!this.fixed){_ref=this.behaviours,_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++)behaviour=_ref[_i],_results.push(behaviour.apply(this,dt,index));return _results}},Particle}(),Spring=function(){function Spring(p1,p2,restLength,stiffness){this.p1=p1,this.p2=p2,this.restLength=restLength!=null?restLength:100,this.stiffness=stiffness!=null?stiffness:1,this._delta=new Vector}return Spring.prototype.apply=function(){var dist,force;this._delta.copy(this.p2.pos).sub(this.p1.pos),dist=this._delta.mag()+1e-6,force=(dist-this.restLength)/(dist*(this.p1.massInv+this.p2.massInv))*this.stiffness,this.p1.fixed||this.p1.pos.add(this._delta.clone().scale(force*this.p1.massInv));if(!this.p2.fixed)return this.p2.pos.add(this._delta.scale(-force*this.p2.massInv))},Spring}(),Physics=function(){function Physics(integrator){this.integrator=integrator!=null?integrator:new Euler,this.timestep=1/60,this.viscosity=.005,this.behaviours=[],this._time=0,this._step=0,this._clock=null,this._buffer=0,this._maxSteps=4,this.particles=[],this.springs=[]}return Physics.prototype.integrate=function(dt){var behaviour,drag,index,particle,spring,_i,_j,_k,_len,_len1,_len2,_ref,_ref1,_ref2,_results;drag=1-this.viscosity,_ref=this.particles;for(index=_i=0,_len=_ref.length;_i<_len;index=++_i){particle=_ref[index],_ref1=this.behaviours;for(_j=0,_len1=_ref1.length;_j<_len1;_j++)behaviour=_ref1[_j],behaviour.apply(particle,dt,index);particle.update(dt,index)}this.integrator.integrate(this.particles,dt,drag),_ref2=this.springs,_results=[];for(_k=0,_len2=_ref2.length;_k<_len2;_k++)spring=_ref2[_k],_results.push(spring.apply());return _results},Physics.prototype.step=function(){var delta,i,time,_ref;(_ref=this._clock)==null&&(this._clock=(new Date).getTime()),time=(new Date).getTime(),delta=time-this._clock;if(delta<=0)return;delta*=.001,this._clock=time,this._buffer+=delta,i=0;while(this._buffer>=this.timestep&&++i<this._maxSteps)this.integrate(this.timestep),this._buffer-=this.timestep,this._time+=this.timestep;return this._step=(new Date).getTime()-time},Physics.prototype.destroy=function(){return this.integrator=null,this.particles=null,this.springs=null},Physics}(),Integrator=function(){function Integrator(){}return Integrator.prototype.integrate=function(particles,dt){},Integrator}(),Euler=function(_super){function Euler(){return Euler.__super__.constructor.apply(this,arguments)}return __extends(Euler,_super),Euler.prototype.integrate=function(particles,dt,drag){var p,vel,_i,_len,_results;vel=new Vector,_results=[];for(_i=0,_len=particles.length;_i<_len;_i++){p=particles[_i];if(!!p.fixed)continue;p.old.pos.copy(p.pos),p.acc.scale(p.massInv),vel.copy(p.vel),p.vel.add(p.acc.scale(dt)),p.pos.add(vel.scale(dt)),drag&&p.vel.scale(drag),_results.push(p.acc.clear())}return _results},Euler}(Integrator),ImprovedEuler=function(_super){function ImprovedEuler(){return ImprovedEuler.__super__.constructor.apply(this,arguments)}return __extends(ImprovedEuler,_super),ImprovedEuler.prototype.integrate=function(particles,dt,drag){var acc,dtSq,p,vel,_i,_len,_results;acc=new Vector,vel=new Vector,dtSq=dt*dt,_results=[];for(_i=0,_len=particles.length;_i<_len;_i++){p=particles[_i];if(!!p.fixed)continue;p.old.pos.copy(p.pos),p.acc.scale(p.massInv),vel.copy(p.vel),acc.copy(p.acc),p.pos.add(vel.scale(dt).add(acc.scale(.5*dtSq))),p.vel.add(p.acc.scale(dt)),drag&&p.vel.scale(drag),_results.push(p.acc.clear())}return _results},ImprovedEuler}(Integrator),Verlet=function(_super){function Verlet(){return Verlet.__super__.constructor.apply(this,arguments)}return __extends(Verlet,_super),Verlet.prototype.integrate=function(particles,dt,drag){var dtSq,p,pos,_i,_len,_results;pos=new Vector,dtSq=dt*dt,_results=[];for(_i=0,_len=particles.length;_i<_len;_i++){p=particles[_i];if(!!p.fixed)continue;p.acc.scale(p.massInv),p.vel.copy(p.pos).sub(p.old.pos),drag&&p.vel.scale(drag),pos.copy(p.pos).add(p.vel.add(p.acc.scale(dtSq))),p.old.pos.copy(p.pos),p.pos.copy(pos),_results.push(p.acc.clear())}return _results},Verlet}(Integrator),Behaviour=function(){function Behaviour(){this.GUID=Behaviour.GUID++,this.interval=1}return Behaviour.GUID=0,Behaviour.prototype.apply=function(p,dt,index){var _name,_ref;return((_ref=p[_name="__behaviour"+this.GUID])!=null?_ref:p[_name]={counter:0}).counter++},Behaviour}(),Attraction=function(_super){function Attraction(target,radius,strength){this.target=target!=null?target:new Vector,this.radius=radius!=null?radius:1e3,this.strength=strength!=null?strength:100,this._delta=new Vector,this.setRadius(this.radius),Attraction.__super__.constructor.apply(this,arguments)}return __extends(Attraction,_super),Attraction.prototype.setRadius=function(radius){return this.radius=radius,this.radiusSq=radius*radius},Attraction.prototype.apply=function(p,dt,index){var distSq;this._delta.copy(this.target).sub(p.pos),distSq=this._delta.magSq();if(distSq<this.radiusSq&&distSq>1e-6)return this._delta.norm().scale(1-distSq/this.radiusSq),p.acc.add(this._delta.scale(this.strength))},Attraction}(Behaviour),Collision=function(_super){function Collision(useMass,callback){this.useMass=useMass!=null?useMass:!0,this.callback=callback!=null?callback:null,this.pool=[],this._delta=new Vector,Collision.__super__.constructor.apply(this,arguments)}return __extends(Collision,_super),Collision.prototype.apply=function(p,dt,index){var dist,distSq,i,mt,o,overlap,r1,r2,radii,_i,_ref,_results;_results=[];for(i=_i=index,_ref=this.pool.length-1;index<=_ref?_i<=_ref:_i>=_ref;i=index<=_ref?++_i:--_i)o=this.pool[i],o!==p?(this._delta.copy(o.pos).sub(p.pos),distSq=this._delta.magSq(),radii=p.radius+o.radius,distSq<=radii*radii?(dist=Math.sqrt(distSq),overlap=p.radius+o.radius-dist,overlap+=.5,mt=p.mass+o.mass,r1=this.useMass?o.mass/mt:.5,r2=this.useMass?p.mass/mt:.5,p.pos.add(this._delta.clone().norm().scale(overlap*-r1)),o.pos.add(this._delta.norm().scale(overlap*r2)),_results.push(typeof this.callback=="function"?this.callback(p,o,overlap):void 0)):_results.push(void 0)):_results.push(void 0);return _results},Collision}(Behaviour),ConstantForce=function(_super){function ConstantForce(force){this.force=force!=null?force:new Vector,ConstantForce.__super__.constructor.apply(this,arguments)}return __extends(ConstantForce,_super),ConstantForce.prototype.apply=function(p,dt,index){return p.acc.add(this.force)},ConstantForce}(Behaviour),EdgeBounce=function(_super){function EdgeBounce(min,max){this.min=min!=null?min:new Vector,this.max=max!=null?max:new Vector,EdgeBounce.__super__.constructor.apply(this,arguments)}return __extends(EdgeBounce,_super),EdgeBounce.prototype.apply=function(p,dt,index){p.pos.x-p.radius<this.min.x?p.pos.x=this.min.x+p.radius:p.pos.x+p.radius>this.max.x&&(p.pos.x=this.max.x-p.radius);if(p.pos.y-p.radius<this.min.y)return p.pos.y=this.min.y+p.radius;if(p.pos.y+p.radius>this.max.y)return p.pos.y=this.max.y-p.radius},EdgeBounce}(Behaviour),EdgeWrap=function(_super){function EdgeWrap(min,max){this.min=min!=null?min:new Vector,this.max=max!=null?max:new Vector,EdgeWrap.__super__.constructor.apply(this,arguments)}return __extends(EdgeWrap,_super),EdgeWrap.prototype.apply=function(p,dt,index){p.pos.x+p.radius<this.min.x?(p.pos.x=this.max.x+p.radius,p.old.pos.x=p.pos.x):p.pos.x-p.radius>this.max.x&&(p.pos.x=this.min.x-p.radius,p.old.pos.x=p.pos.x);if(p.pos.y+p.radius<this.min.y)return p.pos.y=this.max.y+p.radius,p.old.pos.y=p.pos.y;if(p.pos.y-p.radius>this.max.y)return p.pos.y=this.min.y-p.radius,p.old.pos.y=p.pos.y},EdgeWrap}(Behaviour),Wander=function(_super){function Wander(jitter,radius,strength){this.jitter=jitter!=null?jitter:.5,this.radius=radius!=null?radius:100,this.strength=strength!=null?strength:1,this.theta=Math.random()*Math.PI*2,Wander.__super__.constructor.apply(this,arguments)}return __extends(Wander,_super),Wander.prototype.apply=function(p,dt,index){return this.theta+=(Math.random()-.5)*this.jitter*Math.PI*2,p.acc.x+=Math.cos(this.theta)*this.radius*this.strength,p.acc.y+=Math.sin(this.theta)*this.radius*this.strength},Wander}(Behaviour)

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var AtomizedContent = function(){

	var PARTICLE_AMOUNT;
	var physics;
	var viewWidth;
	var viewHeight;
	var context;
	var avoidMouse;
	var pullToCenter;
	var collision;
	var colors;
	var mouseIsDown = false;

	function init(){

		PARTICLE_AMOUNT = 100;

		viewWidth = $(window).width();
		viewHeight = viewWidth * 9/16;

		colors = [
			"e62b1e",
			"e30513",
			"ffed00",
			"009640",
			"009ee3",
			"302683",
			"e5007d",
			// "45b29b",
			// "524bdd",
			// "bb3824",
			// "338777",
			// "DB913A"
		];



		var canvas = $('<canvas />').prependTo('.canvasWrap')[0];
		canvas.addEventListener("mousedown", doMouseDown, false);
		canvas.addEventListener("mouseup", doMouseUp, false);
		context = canvas.getContext("2d");

		context.canvas.width  = viewWidth;
		context.canvas.height = viewHeight;

		// Create a physics instance which uses the Verlet integration method
		physics = new Physics();
		physics.integrator = new Verlet();

		// Design some behaviours for particles
		avoidMouse = new Attraction();
		pullToCenter = new Attraction();

		// Allow particle collisions to make things interesting
		collision = new Collision();


		for ( var i = 0; i < PARTICLE_AMOUNT; i++ ) {
			// Create a particle
			var particle = new Particle( Math.random() );
			var position = new Vector( viewWidth/2 + randomRange(-300, 300), viewHeight/2 + randomRange(-300, 300));
			//particle.mass = randomRange(0.6, 1.5);
			particle.setRadius( particle.mass * 6 );
			particle.color = colors[Math.floor(Math.random()*colors.length)];
			particle.moveTo( position );

			// Make it collidable
			collision.pool.push( particle );

			// Apply behaviours
			particle.behaviours.push( avoidMouse, pullToCenter, collision );

			// Add to the simulation
			physics.particles.push( particle );
    	}

		pullToCenter.target.x = viewWidth / 2;
		pullToCenter.target.y = viewHeight / 2;
		pullToCenter.strength = 220;

		avoidMouse.setRadius( 90 );
		avoidMouse.strength = -6000;

		addEvents();
    	loop();

	}

	function randomRange(min, max) {
    	return Math.random() * (max - min) + min;
	}

	function draw(){

		context.fillStyle = 'rgba(255,255,255,0.002)';
		// context.fillStyle = 'rgba(209,200,192,0.9)';
		// context.fillStyle = 'rgba(0,0,0,0.05)';
		context.fillRect(0, 0, viewWidth, viewHeight);
		//context.fill();

		context.moveTo(viewWidth/2+200, viewHeight/2+100);
		context.lineTo(viewWidth/2+0, viewHeight/2-200);
		context.lineTo(viewWidth/2-200, viewHeight/2+100);
		context.fillStyle = 'rgba(0,0,0,0.05)';
		//context.fillStyle = 'rgba(255,255,255,0.015)';
		context.fill();

		 // Step the simulation
		physics.step();

		// Render particles
		for ( var i = 0, n = physics.particles.length; i < n; i++ ) {

			var particle = physics.particles[i];
			context.beginPath();
			// Circles
			//context.arc( particle.posx	.x, particle.pos.y, particle.radius/2.2, 0, Math.PI * 2 );

			//Triangles
			// context.moveTo(viewWidth/2+25, viewHeight/2+0);
			// context.lineTo(viewWidth/2+0, viewHeight/2-50);
			// context.lineTo(viewWidth/2-25, viewHeight/2+0);

			if (mouseIsDown) {
				context.arc( particle.pos.x, particle.pos.y, particle.radius/1.1, 0, Math.PI * 2 );
				pullToCenter.strength = -220;
			}
			else {
				context.arc( particle.pos.x, particle.pos.y, particle.radius/2.2, 0, Math.PI * 2 );
				pullToCenter.strength = 220;
			}

			//console.log(particle.pos.x, particle.pos.y)
			context.fillStyle = "#" + particle.color.toString(16);
			context.fill();
		}
		

	}

	function loop(){
		//console.log('working....')
		draw();
		window.requestAnimFrame(loop);
	}

	function resize(){
		viewWidth = $(window).width() + 52;
		viewHeight = viewWidth * 9/16;

		context.canvas.width  = viewWidth;
		context.canvas.height = viewHeight;

		pullToCenter.target.x = viewWidth / 2;
		pullToCenter.target.y = viewHeight / 2;

		//console.log('resize')

	}

	function mouseMove(event){
		event = event || window.event; // IE-ism

		var mouseX = event.clientX;
		var mouseY = event.clientY;

		avoidMouse.target.x = mouseX;
   		avoidMouse.target.y = mouseY;
	}

	function doMouseDown() {
		//alert("muuuu");
		mouseIsDown = true;
	}

	function doMouseUp() {
		//alert("muuuu");
		mouseIsDown = false;
	}

	function addEvents(){
		$(document).on('mousemove', mouseMove);
		$(window).on('resize', resize).trigger('resize');
	}

	return {
		init:init
	}
}();

jQuery(function(){
	AtomizedContent.init();
});
