<h1>Salmon Flow!</h1>
![Screenshot of project desktop view]()
![Screenshot of project mobile view]()
## About The Project:
  Salmon Flow is a continuous 2D top-down avoidance game. 
  
  For best playing experience(in my opinion), desktop/laptop with keyboard is best. However, there is a
mobile layout with touchscreen buttons. You can make the width of your browser window less than the height to view the mobile layout on your computer, but you 
will need to be on a touchscreen device for the controls to work. Playing on iPad/tablet makes for a fun little experience. Like wise, if you're on mobile and do not 
have acces to a computer, you can turn your device into landscape to see the desktop view of the webpage.

  The player controls a salmon with left, right, and jump movements. The goal is to make it as far up river as possible
while dodging obstacles. The salmon can also eat flies along the way to score extra points. Once the max speed is reached, indicated by a 
light salmon colored glow around the canvas, jumps are no longer made available -- swimming with extra caution is a must!

  If you find yourself unable to survive long enough to reach max speed, you can press "S" key on your keyboard or the Max Speed button on your touchscreen device located
just below the swim left button. This will allow you to view the changes that happen at max speed and start off the round at max, skipping the lower level speeds if 
you're looking for a greater challenge.

This game has been created from the ground up using HTML, CSS, and JavaScript. 

Game assets and button icons have been made using Inkscape.

In-game music and game over sound were made using https://musiclab.chromeexperiments.com/Song-Maker/.

The font used for headings, score text, level text, etc. is Orbitron, designed by Matt McInerney. The font is found on Google Fonts. I believe the Orbitron font created a 
classic game "feel" to the Salmon Flow website and fit well with the overall theme I was trying to achieve.

<h3>Score & Highscore:</h3>

  Each obstacle passed succesfully --> +1 point added to score.
  Each time the salmon "eats" flies --> +5 points added to score.
  
  Highscore is saved in local storage currently and does not connect to any leader board. Perhaps that will be a future addition. 

<h3>Levels:</h3>

  Levels are incremented every 10 obstacles that are rendered into the game (starting point along the Y-axis is above canvas height).

<h3>Speed/Velocity:</h3>

  velocityY is 4 and increments 0.02 each new level up to a maxVelocityY of 30. Salmon velocityX starts at -8 & 8 (left and right). It increments, controlled in 
  the moveSalmon function, accordingly as the velocityY increases over time.

<h3>Jumping:</h3>
  
  There is a jump function with a call to fall function. During the jump and for 3 seconds after, collisions between salmon and obstacles are not detected.
  Three jumps are initially made available. Once all three are used, it takes 15 seconds for all three to renew. If max speed is reached, no jumps are made 
  available any longer.

<h3>Collision Detection:</h3>

  Collision detection was a challenge for me, especially since this is my very first project. I realized I didn't take certain things into account when creating the
  assets. When the salmon image collided with the obstacle image using a standard collsiion detection formula between two rectangles, it did not visibly look like a 
  collision due to empty spaces in the image corners. "What did you do to fix the issue?", you ask?... 

  Well, it is probably up for debate if its a fix. Lets call it a workaround...

  There is an ellipse shape overlaying the salmon and each of the obstacles. Then there is a rectangle shape overlaying the salmons length and no wider than the ellipse.
  Then there is a small rectangle at the bottom of the obstacle images centered horizontally. 

  The first collision is detected if the overlaying rectangle of the salmon collides with the overlaying rectangle of the obstacles. This works to detect the collision when 
  it is a head on collsiion. As well, it detects collisions at certain angles not otherwise detected. 

  The second collision is between the ellipse that overlays the salmon and the ellipse overlaying each of the obstacles. This works somewhat. I thought I would get away with 
  just the ellipse collision detection, but after much reading, apparently the collision detection formula for two ellipses colliding is not the most accurate. Thats where 
  the collision detection between the two overlaying rectangles picks up the slack. 

  So bascially, the two collision detection formulas act as one to make the collision more visibly accurate to the players' eye. Overriding the issue of the empty spaces in 
  the corners of the graphics' bounding boxes causing a visibly inaccurate collision detection. 

  Then finally, the overlaying ellipses and rectangles are all made transparent, of course!

  <h3>Obstacles:</h3>

  I originally started with two obstacle types, beavers and driftwood. The velocityY for beaver is slightly faster than for driftwood. As I overcame the main challenges for the 
mechanics of the game, it was suggested by my mentor that it would be a good idea to starting adding more obstacle images. So now, the there is a group of images designated 
to the beaver obstacle and its rules, and a group of images designated to the driftwood obstacle and its rules. Everytime an obstacle is rendered into the game now, if it is a 
beaver obstacle type, the image displayed is randomly selected from its designated group of images. Likewise for the driftwood obstacle type and its designated image group. So the 
images will vary and are not particularly a beaver or driftwood everytime. Depending on which group the image comes from, that will determine the velocity of the obstacle.

<h3>Shout-out:</h3>

  My mentor for this project was Hai Nghiem. He played an important role in helping me to plan accordingly, and to tackle issues one step at a time with the overall goal in mind.
 My confidence in my ability to successfully complete this project grew as time went on, and Hai's patience and support was instrumental in that process. 
 
Thank you, Hai!

  
  

