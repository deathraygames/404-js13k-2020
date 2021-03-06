// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
let zzfx= // the core 'play' method
(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{
	let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);q=zzfxX.createBuffer(1,h,zzfxR);q.getChannelData(0).set(Z);c=zzfxX.createBufferSource();c.buffer=q;c.connect(zzfxX.destination);c.start();return c
},
zzfxV=.3, // volume
zzfxX=new(window.AudioContext||webkitAudioContext), // audio context
zzfxR=44100 // sample rate
;

// Customization based on https://killedbyapixel.github.io/ZzFX/

const GUN = [,,470,,,.13,4,1.78,-0.3,,-50,.04,.02,.1,-0.2,.4,,.51,.04,.01];
const EXPLODE = [,,651,,.2,.88,4,1.22,.3,,,,,.6,,1,,.51,.01];
const THRUST = [.6,,980,,.51,1.62,4,2.35,,,,,,.3,.7,.9,.13,.73,.06];
const DEATH = [1.3,,117,.12,.27,1.21,4,2,.7,,,,,.8,,.9,.34,1.1,.04,.2];
const JUMP = [,,452,,.08,.46,2,.73,2.4,,,,,,,,.04,.51];

export default {
	gun() { zzfx(...GUN); },
	explode() { zzfx(...EXPLODE); },
	thrust() { zzfx(...THRUST); },
	death() { zzfx(...DEATH); },
	jump() { zzfx(...JUMP); },
};
