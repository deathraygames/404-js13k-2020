# 404 Orbiting Asteroids for JS13k 2020

Play the latest version: https://deathraygames.github.io/404-js13k-2020/dist/

## JS13k

* [JS13k Rules](http://2020.js13kgames.com/#rules): Make a game with a package size less than 13k (13,312 bytes) in one month
* Theme: *"404"*
* Entry for this game: ...(TBD)...
* See all the entries for the competition at http://2020.js13kgames.com/

## Post Mortem

I didn't have a lot of inspiration with the theme of "404", so I decided to use this challenge as an excuse to [learn WebGL](https://xem.github.io/articles/webgl-guide.html) and to improve [my physics library](https://github.com/rocket-boots/physics). I enjoyed working with basic spaceship flying as part of [Return to the Moon](https://github.com/deathraygames/lunar-lander-13k) in 2019, so settled on making a simple [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)) "clone". Because there wasn't a lot of originality to the gameplay, I ended up using a very literal title: *"404 Orbiting Asteroids"*.

I spent most of the month learning WebGL and working on a **starfield background**, which resulted in [webgl-starfield](https://github.com/rocket-boots/webgl-starfield) and a helper library [webglp](https://github.com/rocket-boots/webglp) to help smooth out some of the ugly WebGL js code.

As a clone of classic the **gameplay** didn't require too much thought: *Fly around, shoot asteroids*. I knew I wanted some gravity to make flying more interesting, and since it [didn't make too much sense](https://twitter.com/deathraygames/status/1300966473280753664/photo/1) to have the asteroids with a strong force of gravity, I decided to add a big mass in the center. I originally wanted a sun and a few planets (like [Star Hopper Glitch Jump](https://github.com/deathraygames/star-hopper-glitch)), but knew it would be too complicated to keep the planets in orbit, so I just stuck with one mass: a sun.

When it game time to work on the **controls** I decided to copy Reassembly, a game I really enjoy. Rotation of the ship follows the mouse, clicking fires the weapons. To make the game playable entirely by mouse I made the right-click fire the engines. Later on I also added some keyboard controls: "w" to fire engines and space bar to fire.

After the game was playable I realized it desperately needed some **sounds** to give the experience more depth. I considered [jsfxr](https://github.com/mneubrand/jsfxr), but then found that [ZzFX micro](https://github.com/KilledByAPixel/ZzFX/blob/master/ZzFX.micro.js) is smaller and offered simple sound effects that I was looking for. I created the sounds by experimenting with [the ZzFX tool](https://killedbyapixel.github.io/ZzFX/), and put everything into a `sounds.js` file.
