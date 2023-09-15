function Movie_OnStart(){

}

function Movie_OnUpdate(TimeChange,SecondsChange){// force fps patch

// detect time changes
time_passed_patch += SecondsChange;

// now cacular the fps
fps_patch = Math.floor(time_passed_patch / fps_time);

// remove the passed fps
while(time_passed_patch > fps_time)
{
	time_passed_patch -= fps_time;
}

// call update core logic
for(var i=0;i<fps_patch;i++)
	coreLogic();

//show fps
//DEBUG(fps_patch);
}

function Movie_OnClick(X,Y,MouseButton){jump();
}

function Movie_OnKeyPress(Key){switch(GetSceneName())
{
	case "Demo":
		startGame();
		break;
	case "Game":
		jump();
}
}

function Frame__0_0(ID){Stop();

}

function Frame__1_0(ID){Stop();

}

function Frame__2_0(ID){Stop();


}

function Frame__2_1(ID){createBlocker();

}

function startGameButton_OnClick(){showDemo();
}

function startGameRect_OnClick(){startGame();
}

function restartGameButton_OnClick(){showMenu();
}

// Flappy Bird Demo By FlashKnight
// demo link : http://flappybird.samgsa.com
//
//--------------------------------------------------------------------------------------------------------
// This source code is fully open , and you can use, copy , modify , recomplie , redistribute with no copyrights issue.
// And I patched this source code almost 3 times , rewrite it almost 2 times.
// It is OOP and very easy to read , I am trying to comment every line.
// There are few things that uncomfortable to implements, but I believe it will be better and better in the future !
// You can also remove these illustrations , or feel free to contact me.
// Email: flash.knight@qq.com
//---------------------------------------------------------------------------------------------------------
//

var status = "fly"; //fly , jump
var isDied = true; // if died , no more jumping and moving
var isPaused = true; // if paused , disable all cacularations
var targetY = 0; // jumping height
var speed = 0; // the current speed
var gSpeed = 0.098 * 5; // the add-on speed
var blockers = new Array(); // all blockers created with random position
var removeIndex = 0; // no.. I don't like this ether , but it is difficute to know which blocker to remove.
var createIndex = 0; // and also no .. I don't like this , but it is difficute to know the new index.
var score = 0;


// PATCHS:
//
// 1. the frame is not the best chooise to detect whether to create new blocker or not , different device will have diffrent fps , we should use the real distance to cacular the detection
var distance_passed = 0;
var distance_patch_started = false; // if start the game , start cacular
var distance_to_create_block = 180;

// 2. the move should depends on actual time , not the Update() call. so let's patch the Update() event.
var time_passed_patch = 0;
var fps_patch = 0;
var fps = 30;
var fps_time = 1000/fps/1000;


// all symbols bellow on the stage :
// backGround , bird , floor , retstartButton , blocker, scoreT

function DEBUG(any)
{
	TextBoxSet("debug",any);
}

// start the game
function startGame()
{
	score = 0;
	ImageSequenceSetIndex("scoreT",score+1);

	isDied = false;
	isPaused = false;

	bird.Y = 200;
	speed = 0;
	
	gameOverLogo.Visible = false;
	restartButton.Visible = false;
	
	GotoSceneName("Game");
	
	removeAllBlockers(); // clearing ...
	jump(); // it is because the "Demo" scene taped once.

	TimelinePlay("backGround");
	TimelinePlay("floor");
	TimelinePlay("bird");
	
	startCreateBlockers(); // go loop to create blockers. we could use setInterval(), but it is not working in the Test Player.
}

// show the demo scene.
function showDemo()
{
	GotoSceneName("Demo");
}

// trying to jump , and play a sound.
function jump()
{
	if(isDied || isPaused) return;
	if(status == "fly")
	{
		status = "jump";
		targetY = bird.Y - 35;
		speed = 0;
		
		TimelinePlayClip("jumpSound",0,12);
		
	}
}

// if game over ,call this.
function gameOver()
{
	isDied = true;
	distance_patch_started = false;

	TimelinePause("backGround");
	TimelinePause("floor");
	TimelinePause("bird");

	playDiedSound();
}

// show the main menu scene.
function showMenu()
{
	GotoSceneName("Menu");
}

// create one blocker.
function createBlocker()
{
	var createdBlocker = ItemDuplicate("blocker" , "blocker"+createIndex);
	createdBlocker.Y += Math.random() * 150;
	createdBlocker.Y -= Math.random() * 150;
	blockers.push(createdBlocker);
	createIndex++;
}

// remove the nearest blocker
function removeBlocker()
{
	ItemDelete("blocker"+removeIndex);
	blockers.shift();
	removeIndex ++;
}

// moving all blockers,
function moveAllBlockers()
{
	var blocker;
	for(var i=0;i<blockers.length;i++)
	{
		blocker = blockers[i];
		
		// checking hits , if hitted , game over.
		if(checkHitTest(blocker))
			gameOver();
		
		if(blocker.X < -50) //-50 is the edge to remove
		{
			removeBlocker();
			continue;
		}
	
		if(blocker.Height == 730 && blocker.X < 40) // the bird.X = 44
			addScoreAndMark(blocker);
		
		// moving all blockers one by one.
		blocker.X -= 3;
	}
}

// remove all blockers , clear the stage.
function removeAllBlockers()
{
	while(blockers.length)
		removeBlocker();
}


// the most bad ideas goes here ...
// target is a blocker
function checkHitTest(target)
{
	//TextBoxSet("debug", "block: "+Math.round(blockers[0].Y) + ", bird: " +Math.round(bird.Y)+")");
	// check if the bird is hitting a blocker. if hits , return true.
	return (bird.X >= target.X - 30) && (bird.X <= target.X + 50) && (bird.Y <= (target.Y - 30 - 20) /*95-65 +/- 40*/ || bird.Y > (target.Y - 30 + 60)) ;
}

// if fails on the ground , show restart game ui.
function showGameOverUI()
{
	gameOverLogo.Visible = true;
	restartButton.Visible = true;
	isPaused = true;
}

// create a loop to start blocker creating..
function startCreateBlockers()
{
	//PlayLoop(1,12); // patch this , because the frame is different between each devices.
	distance_passed = 0;
	distance_patch_started = true;
}


function cacularDistanceAndPatch()
{
	distance_passed += 3;
	// detection
	if(distance_passed > distance_to_create_block)
	{
		distance_passed -= distance_to_create_block;
		createBlocker();
	}
}


// play a died sound
function playDiedSound()
{
	TimelinePlayClip("diedSound",0,16);
}

// this is the Update() event core Logic
function coreLogic()
{
	// pause all caculartions , including jump , blocker check , score counting.
	if(isPaused) return;
	
	// the floor.Y is center of the floor.Height , so ,it is bad idea to use it's .Y in global xy position. 
	var floorY = floor.Y - (floor.Height / 2) - bird.Height;
	
	// if died , check the bird is on the ground or not
	if(isDied)
	{
		if(bird.Y >= floorY)
		{
			// if fail on the ground , show game over ui
			showGameOverUI();
			isDied = true;
			isPaused = true;
			bird.Y = floorY ;
		}else{
			// fail the bird on the ground
			status = "fly";
		}
	}else{
		// move all blockers to left , and check the hit test.
		moveAllBlockers();
		// cacular the distance to detect if to create new  blocker or not
		if(distance_patch_started) cacularDistanceAndPatch();
	}
		
	// now we are manage the jump and fail action.
	if(status == "jump")
	{
		if(bird.Y <= targetY)
		{
			// complete jump
			status = "fly";
		}else{
			// jumping
			bird.Y -= 3;
			bird.Angle = -20; // head up
		}
	}else{
		// flying and falling
		bird.Y += speed;
		speed += gSpeed;
		bird.Angle = 20; // head down
	}

	// now we are checking the game over event
	if(bird.Y > floorY) gameOver();
}

// and score , it is very hard to draw all 100+ score in the PS or timeline.
// so I leave it.
function addScoreAndMark(blocker)
{
	if(score > 9)
		score = 9;
	else
		score ++;
	ImageSequenceSetIndex("scoreT",score+1);
	
	// mark , we could write "blocker['mark'] = true" , but also won't work in the Debug Player
	blocker.Height = 731;

	SoundPlay("sfx_point",false);

}

