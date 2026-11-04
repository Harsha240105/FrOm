const $=id=>document.getElementById(id);
const STORE='FORM_MONOCHROME_LOG_V1';
const PROFILE_KEY='FORM_PROFILE_V1';
const BACKUP_KEY='FORM_MONOCHROME_LOG_V1_BACKUP_V02';
const ACTIVE_KEY='FORM_ACTIVE_V1';
const DAY=86400000;

const images={
  march:{url:'assets/exercises/march.webp',source:'CTO-AM physiotherapy guide',link:'https://cto-am.com/rehabilitacion-cadera.php',alt:'A person demonstrating a standing march by lifting one knee'},
  chair:{url:'assets/exercises/chair.jpg',source:'NHS strength exercise guide',link:'https://www.nhs.uk/live-well/exercise/strength-exercises/',alt:'A person demonstrating a chair sit-to-stand'},
  wall:{url:'assets/exercises/wall.webp',source:'Lianhe Zaobao physiotherapy exercise guide',link:'https://www.zaobao.com.sg/lifestyle/health/story20220913-1312426',alt:'A physiotherapist demonstrates a wall push-up'},
  hinge:{url:'assets/exercises/hinge.jpg',source:'Home Gym Supply exercise guide',link:'https://homegymsupply.co.uk/blogs/guides/hip-hinge-exercises',alt:'A person demonstrating the bodyweight hip hinge'},
  bridge:{url:'assets/exercises/bridge.png',source:'NHS MSK Bexley exercise guide',link:'https://msk-bexley.nhs.uk/conditions/hip-pain/gluteal-tendinopathy',alt:'A person demonstrating the glute bridge'},
  calf:{url:'assets/exercises/calf.jpg',source:'The Philadelphia Inquirer fitness guide',link:'https://www.inquirer.com/philly/health/personal-best/out-of-breath-after-a-flight-of-stairs-heres-why-and-how-to-fix-it-20180806.html',alt:'A woman demonstrates a calf raise'},
  side:{url:'assets/exercises/side.png',source:'Hinge Health exercise guide',link:'https://www.hingehealth.com/resources/articles/standing-side-leg-raise/',alt:'A woman demonstrates a standing side leg raise'}
};

const LEGACY_E={
  walk:{id:'walk',name:'Comfortable walk',focus:'Cardio · stamina',kind:'time',seconds:900,sets:1,restSet:0,restNext:0,photo:'march',group:'Legacy',position:'Stand in a safe place with comfortable shoes.',steps:['Walk at a comfortable, steady pace.','Keep breathing naturally and stay in a safe place.','Slow down if you become unusually breathless.'],posture:'Relaxed shoulders. Natural stride.',breathing:'Steady breathing you can still speak through.',tip:'This is a preserved v1.0 session. New plans do not include walking in the workout timer.'},
  mobility:{id:'mobility',name:'Standing mobility',focus:'Flexibility · movement',kind:'time',seconds:300,sets:1,restSet:0,restNext:0,photo:'side',group:'Legacy',position:'Stand beside a stable support.',steps:['Make small, comfortable movements through your hips and ankles.','Keep the movements gentle and controlled.','Do not force a stretch or hold your breath.'],posture:'Tall and relaxed. Use support as needed.',breathing:'Easy, continuous breathing.',tip:'This is a preserved v1.0 session.'},
  wall:{id:'wall',name:'Wall push-up',focus:'Chest · arms',kind:'reps',reps:8,sets:1,restSet:30,restNext:30,photo:'wall',group:'Legacy',position:'Face a wall with feet comfortable and palms at chest height.',steps:['Place both palms on the wall at chest height.','Keep your body straight and bend your elbows towards the wall.','Push the wall away to return to standing.'],posture:'Straight body. Shoulders away from ears.',breathing:'Breathe in as you bend. Breathe out as you push.',tip:'Preserved v1.0 exercise.'},
  side:{id:'side',name:'Standing side leg raise',focus:'Outer hips · balance',kind:'reps',reps:6,sets:1,restSet:30,restNext:30,photo:'side',group:'Legacy',eachSide:true,position:'Stand beside a stable support.',steps:['Hold the support lightly.','Move one leg out to the side without leaning your body.','Return slowly and repeat on the other side.'],posture:'Tall trunk. Do not lean away from the moving leg.',breathing:'Breathe normally throughout.',tip:'Preserved v1.0 exercise.'}
};

const E={
  march:{id:'march',name:'March in place',focus:'Warm-up · whole body',kind:'time',seconds:120,sets:1,restSet:10,restNext:20,photo:'march',group:'Warm-up',position:'Stand tall with feet about hip-width apart and space in front of you.',steps:['Place your arms by your sides and look forward.','Lift one foot a little, place it down, then alternate.','Keep the pace easy and stay light on your feet.'],posture:'Tall but relaxed. Do not lean backwards or lock your knees.',breathing:'Breathe normally. You should be able to speak a full sentence.',tip:'March in a smaller range or hold a stable chair if balance feels uncertain.'},
  wallangel:{id:'wallangel',name:'Wall angel',focus:'Upper back · shoulders',kind:'reps',reps:8,sets:1,restSet:20,restNext:25,group:'Mobility',position:'Stand with your back near a wall, feet a short step forward.',steps:['Keep the back of your head and upper back close to the wall.','Bend your elbows and place the backs of your hands near the wall.','Slide your arms slowly up and down without forcing the range.','Return to the starting position with control.'],posture:'Ribs down. Do not arch your lower back to reach higher.',breathing:'Breathe in as you slide up. Breathe out as you lower.',tip:'If your hands cannot touch the wall, keep them close and use a smaller range.'},
  chair:{id:'chair',name:'Chair sit-to-stand',focus:'Thighs · hips',kind:'reps',reps:8,sets:1,restSet:30,restNext:35,photo:'chair',group:'Strength',position:'Sit near the front of a stable chair with both feet flat and knees over your feet.',steps:['Lean your chest slightly forward and push through your feet.','Stand up smoothly without swinging your arms.','Pause tall, then lower yourself slowly back to the chair.','Touch the chair gently and repeat.'],posture:'Knees track over toes. Keep the chest open and back comfortable.',breathing:'Breathe out as you stand. Breathe in as you lower.',tip:'Use the armrests or a higher chair if you cannot stand without a large push.'},
  wallpush:{id:'wallpush',name:'Wall push-up',focus:'Chest · arms',kind:'reps',reps:8,sets:1,restSet:30,restNext:35,photo:'wall',group:'Strength',position:'Face a wall with feet a short step back and palms at chest height.',steps:['Place your palms slightly wider than your shoulders.','Keep your body in one straight line and bend your elbows.','Move your chest towards the wall without shrugging.','Push the wall away to return with control.'],posture:'Straight line from head to heels. Do not let the hips sag.',breathing:'Breathe in as you lower. Breathe out as you push.',tip:'Stand closer to the wall to make it easier. Move the feet back to make it harder.'},
  inclinepush:{id:'inclinepush',name:'Incline push-up',focus:'Chest · arms',kind:'reps',reps:8,sets:1,restSet:35,restNext:40,group:'Strength',position:'Place both hands on a stable table or counter edge, feet a short step back.',steps:['Set your hands slightly wider than your shoulders.','Keep your body straight and bend your elbows towards the surface.','Lower until your chest is close, then push away.','Keep the surface still throughout.'],posture:'Straight body. Neck relaxed. Hips not sagging.',breathing:'Breathe in on the way down. Breathe out on the way up.',tip:'Use a higher surface to make it easier. Use the wall if the table feels unstable.'},
  kneepush:{id:'kneepush',name:'Knee push-up',focus:'Chest · arms · core',kind:'reps',reps:6,sets:1,restSet:40,restNext:40,group:'Strength',position:'Kneel on a padded surface with hands under your shoulders.',steps:['Place your hands slightly wider than your shoulders.','Keep a straight line from head to knees.','Bend your elbows and lower your chest with control.','Push away without letting the hips sag.'],posture:'Head, hips, and knees in one line. Do not tuck the chin.',breathing:'Breathe in as you lower. Breathe out as you push.',tip:'Place a folded towel under the knees. Return to the wall push-up if the knees complain.'},
  hinge:{id:'hinge',name:'Standing hip hinge',focus:'Hips · back of legs',kind:'reps',reps:8,sets:1,restSet:30,restNext:35,photo:'hinge',group:'Strength',position:'Stand with feet hip-width apart and knees softly bent.',steps:['Place your hands on your hips or thighs.','Move your hips backwards as if closing a drawer behind you.','Keep your back comfortable and stop before you feel a strong stretch.','Push the floor away and return to standing.'],posture:'Long spine. Do not round the back or lean backwards at the top.',breathing:'Breathe in as you hinge back. Breathe out as you stand.',tip:'Use a wall behind your hips as a guide. The movement is small at first.'},
  bridge:{id:'bridge',name:'Glute bridge',focus:'Glutes · hips',kind:'reps',reps:8,sets:1,restSet:30,restNext:35,photo:'bridge',group:'Strength',position:'Lie on a comfortable surface with knees bent and feet flat.',steps:['Place your heels a comfortable distance from your hips.','Gently tighten your buttocks and lift your hips.','Stop where your body forms a comfortable line.','Lower slowly and repeat.'],posture:'Do not arch the lower back at the top. Keep the ribs down.',breathing:'Breathe out as you lift. Breathe in as you lower.',tip:'Lift only a little if you feel it in your lower back. Move the feet closer to make it easier.'},
  calf:{id:'calf',name:'Standing calf raise',focus:'Calves · balance',kind:'reps',reps:10,sets:1,restSet:25,restNext:30,photo:'calf',group:'Strength',position:'Stand near a stable chair or wall for light support.',steps:['Place your feet hip-width apart and stand tall.','Raise your heels slowly and rise onto the balls of your feet.','Pause for a moment without wobbling.','Lower your heels with control and repeat.'],posture:'Keep your ankles straight. Do not roll onto the outer edges of the feet.',breathing:'Breathe out as you rise. Breathe in as you lower.',tip:'Hold the support with both hands if balance is uncertain.'},
  sidelift:{id:'sidelift',name:'Standing side leg raise',focus:'Outer hips · balance',kind:'reps',reps:6,sets:1,restSet:30,restNext:30,photo:'side',group:'Strength',eachSide:true,position:'Stand beside a stable support with your weight on one leg.',steps:['Hold the support lightly and stand tall.','Move the free leg out to the side without leaning your trunk.','Pause briefly, then return slowly.','Complete the repetitions on one side, then switch legs.'],posture:'Keep the pelvis level. Do not lean away from the moving leg.',breathing:'Breathe normally. Do not hold your breath.',tip:'Use a smaller range and keep the toes facing forward.'},
  birddog:{id:'birddog',name:'Bird dog',focus:'Core · back · balance',kind:'reps',reps:6,sets:1,restSet:35,restNext:35,group:'Core',eachSide:true,position:'Kneel on all fours with hands under shoulders and knees under hips.',steps:['Brace your middle gently without sucking in your stomach.','Reach one arm forward and the opposite leg back.','Keep the hips level and the back long.','Return with control and switch sides.'],posture:'Do not let the lower back sag or the hips rotate.',breathing:'Breathe out as you reach. Breathe in as you return.',tip:'Lift only the arm first if the full version feels unstable.'},
  deadbug:{id:'deadbug',name:'Dead bug',focus:'Deep core · coordination',kind:'reps',reps:6,sets:1,restSet:35,restNext:35,group:'Core',eachSide:true,position:'Lie on your back with knees bent over hips and arms pointing up.',steps:['Gently lower your ribs towards the floor.','Slowly reach one arm overhead and the opposite leg forward.','Stop before your lower back lifts away from the floor.','Return and switch sides.'],posture:'Keep the lower back gently supported by the floor.',breathing:'Breathe out as you reach. Breathe in as you return.',tip:'Move only the legs, or only the arms, if the full version is too difficult.'},
  pelvictilt:{id:'pelvictilt',name:'Pelvic tilt',focus:'Deep core · lower back',kind:'reps',reps:8,sets:1,restSet:25,restNext:30,group:'Core',position:'Lie on your back with knees bent and feet flat.',steps:['Notice the small curve under your lower back.','Gently tighten your stomach and flatten the curve towards the floor.','Hold for a quiet breath, then relax.','Repeat without pushing hard or lifting the hips.'],posture:'Small movement only. Do not flatten by force.',breathing:'Breathe out as you flatten. Breathe in as you relax.',tip:'Place one hand under your lower back to feel the small change.'},
  clamshell:{id:'clamshell',name:'Clamshell',focus:'Outer hips · glutes',kind:'reps',reps:8,sets:1,restSet:30,restNext:30,group:'Core',eachSide:true,position:'Lie on your side with knees bent, hips stacked, and feet together.',steps:['Keep your feet touching and hips stacked.','Lift the top knee without rolling your pelvis backwards.','Pause briefly at a comfortable height.','Lower slowly and repeat before switching sides.'],posture:'Do not let the waist roll back. Keep the movement at the hip.',breathing:'Breathe out as you lift. Breathe in as you lower.',tip:'Place your back near a wall to notice if you roll away from it.'},
  wallsit:{id:'wallsit',name:'Wall sit',focus:'Thighs · endurance',kind:'time',seconds:20,sets:1,restSet:40,restNext:40,group:'Strength',position:'Stand with your back against a clear wall, feet a step forward.',steps:['Slide down until your knees are comfortably bent.','Keep your back supported by the wall.','Hold the position while breathing normally.','Slide up slowly when the timer ends.'],posture:'Knees track over feet. Do not let them collapse inward.',breathing:'Steady breathing. Do not hold your breath.',tip:'Stay higher if your knees or back complain. A shorter hold is enough.'},
  stepup:{id:'stepup',name:'Step up',focus:'Thighs · balance',kind:'reps',reps:6,sets:1,restSet:35,restNext:35,group:'Strength',eachSide:true,position:'Stand in front of a low, stable step with a support nearby.',steps:['Place one whole foot on the step.','Push through that foot and stand up tall.','Step down slowly with the same leg.','Complete the repetitions, then switch legs.'],posture:'Keep the knee tracking over the foot. Do not push off the back leg.',breathing:'Breathe out as you step up. Breathe in as you lower.',tip:'Use a lower step or hold a rail if balance is uncertain.'},
  squat:{id:'squat',name:'Chair-assisted squat',focus:'Thighs · hips',kind:'reps',reps:8,sets:1,restSet:40,restNext:40,group:'Strength',position:'Stand facing a stable chair with feet about hip-width apart.',steps:['Hold the chair back lightly with both hands.','Bend your hips and knees as if sitting down.','Lower only as far as you can control.','Push through your feet to stand tall.'],posture:'Chest open. Knees follow the toes. Heels stay down.',breathing:'Breathe in as you lower. Breathe out as you stand.',tip:'Use a higher chair or reduce the depth to make it easier.'},
  lunge:{id:'lunge',name:'Supported split squat',focus:'Thighs · balance',kind:'reps',reps:6,sets:1,restSet:40,restNext:40,group:'Strength',eachSide:true,position:'Stand beside a stable support with one foot slightly forward and one back.',steps:['Hold the support lightly and stand tall.','Lower both knees a little, keeping the front foot flat.','Stop before the front knee feels strained.','Push through the front foot to stand, then switch sides.'],posture:'Trunk tall. Front knee tracks over the foot.',breathing:'Breathe in as you lower. Breathe out as you stand.',tip:'Keep the range small. Use a chair for balance throughout.'},
  proney:{id:'proney',name:'Prone Y-T raise',focus:'Upper back · shoulders',kind:'reps',reps:6,sets:1,restSet:30,restNext:30,group:'Strength',position:'Lie face down on a comfortable surface with your forehead resting on a folded towel.',steps:['Reach your arms into a wide Y shape with thumbs up.','Lift both arms a little without lifting the chest.','Pause, then lower slowly.','Move the arms into a T shape and repeat.'],posture:'Keep the neck long and the ribs resting down.',breathing:'Breathe out as you lift. Breathe in as you lower.',tip:'Lift only a few centimetres. Small is enough.'},
  openbook:{id:'openbook',name:'Open book',focus:'Upper back · chest',kind:'reps',reps:6,sets:1,restSet:20,restNext:25,group:'Mobility',eachSide:true,position:'Lie on your side with knees bent and arms together in front of you.',steps:['Keep the knees stacked and still.','Slide the top arm across like opening a book.','Let the chest turn towards the ceiling without forcing.','Return slowly and repeat before switching sides.'],posture:'Keep the hips stacked. The movement comes from the upper back.',breathing:'Breathe in as you open. Breathe out as you return.',tip:'Place a pillow under the head and use a smaller range if the shoulder complains.'},
  hipflexorstretch:{id:'hipflexorstretch',name:'Half-kneeling hip flexor stretch',focus:'Front of hips',kind:'time',seconds:30,sets:1,restSet:15,restNext:20,group:'Mobility',position:'Kneel on one knee on a padded surface with the other foot in front.',steps:['Place a folded towel under the down knee.','Gently tuck the pelvis and stand tall through the trunk.','Move the hips forward a little until you feel a mild stretch.','Hold for about 15 seconds, then switch sides.'],posture:'Do not arch the lower back. Keep the ribs down.',breathing:'Slow, relaxed breathing. Do not hold your breath.',tip:'Use a smaller range if the knee or hip feels compressed.'},
  hamstringstretch:{id:'hamstringstretch',name:'Standing hamstring stretch',focus:'Back of thighs',kind:'time',seconds:40,sets:1,restSet:15,restNext:20,group:'Mobility',position:'Stand tall with one heel placed slightly forward and a support nearby.',steps:['Keep the front leg nearly straight and the foot flexed.','Hinge gently from the hips with a long back.','Hold for about 20 seconds without bouncing.','Switch sides for the second half of the timer.'],posture:'Long spine. Do not round the back to reach lower.',breathing:'Slow, steady breathing.',tip:'Bend the knee slightly if the stretch feels sharp behind the knee.'},
  balance:{id:'balance',name:'Supported balance',focus:'Balance · stability',kind:'time',seconds:30,sets:2,restSet:25,restNext:20,group:'Balance',position:'Stand beside a stable chair or wall with fingertips lightly touching support.',steps:['Shift your weight onto one foot.','Lift the other foot just off the floor.','Hold gently, using the support only when needed.','Switch feet halfway through the timer.'],posture:'Tall and relaxed. Keep your eyes on one point.',breathing:'Normal breathing.',tip:'Keep both hands on the support if balance is uncertain.'},
  cool:{id:'cool',name:'Easy cool-down',focus:'Recovery',kind:'time',seconds:120,sets:1,restSet:0,restNext:0,photo:'march',group:'Cool-down',position:'Stand in a safe space with enough room to move slowly.',steps:['March slowly or walk around the room.','Let your breathing settle gradually.','Shake out your arms and shoulders gently.','Finish feeling comfortable, not exhausted.'],posture:'Relaxed and upright.',breathing:'Slow, easy breathing.',tip:'Stop early if you feel dizzy or unusually breathless.'}
};

const WEEK_V1={
  0:{title:'Rest day',time:'Recovery',mins:0,ids:[]},
  1:{title:'Strength A',time:'05:00–05:30 AM',mins:30,ids:['march','chair','wall','hinge','bridge','calf','cool']},
  2:{title:'Walk + mobility',time:'05:00–05:30 AM',mins:25,ids:['walk','mobility']},
  3:{title:'Strength B',time:'05:00–05:30 AM',mins:30,ids:['march','chair','side','bridge','calf','cool']},
  4:{title:'Walk + mobility',time:'05:00–05:30 AM',mins:25,ids:['walk','mobility']},
  5:{title:'Strength A',time:'05:00–05:30 AM',mins:30,ids:['march','chair','wall','hinge','bridge','calf','cool']},
  6:{title:'Stamina + balance',time:'05:00–05:30 AM',mins:25,ids:['walk','balance','mobility']}
};

function planBlock(title,mins,ids){return {title,time:'04:00–05:30 AM',mins,ids}}
const PROGRAMS={
  1:{
    0:planBlock('Mobility and confidence',20,['march','wallangel','bridge','clamshell','birddog','openbook','hipflexorstretch','balance','cool']),
    1:{title:'Rest and make-up',time:'Recovery',mins:0,ids:[]},
    2:planBlock('Gentle start',20,['march','wallangel','chair','wallpush','hinge','bridge','calf','cool']),
    3:planBlock('Balance and core',20,['march','sidelift','birddog','deadbug','clamshell','wallsit','stepup','calf','cool']),
    4:planBlock('Posture and push',20,['march','wallangel','chair','inclinepush','hinge','bridge','pelvictilt','openbook','cool']),
    5:planBlock('Steady strength',22,['march','wallpush','kneepush','sidelift','deadbug','stepup','birddog','calf','cool']),
    6:planBlock('Confidence circuit',22,['march','chair','wallpush','hinge','wallsit','stepup','squat','hamstringstretch','cool']),
  },
  2:{
    0:planBlock('Mobility and core',25,['march','wallangel','bridge','pelvictilt','deadbug','openbook','hipflexorstretch','hamstringstretch','balance','cool']),
    1:{title:'Rest and make-up',time:'Recovery',mins:0,ids:[]},
    2:planBlock('Strength A',26,['march','wallangel','inclinepush','kneepush','hinge','bridge','calf','deadbug','cool']),
    3:planBlock('Core and posture',25,['march','sidelift','birddog','deadbug','pelvictilt','clamshell','wallsit','openbook','cool']),
    4:planBlock('Strength B',26,['march','wallangel','wallpush','kneepush','hinge','bridge','stepup','calf','cool']),
    5:planBlock('Balance and control',26,['march','chair','sidelift','birddog','clamshell','wallsit','squat','balance','cool']),
    6:planBlock('Full body',28,['march','wallpush','inclinepush','hinge','stepup','squat','calf','proney','deadbug','cool']),
  },
  3:{
    0:planBlock('Mobility and core',30,['march','wallangel','bridge','pelvictilt','deadbug','openbook','hipflexorstretch','hamstringstretch','balance','cool']),
    1:{title:'Rest and make-up',time:'Recovery',mins:0,ids:[]},
    2:planBlock('Strength A',34,['march','wallangel','wallpush','kneepush','inclinepush','hinge','bridge','calf','deadbug','cool']),
    3:planBlock('Core and posture',32,['march','sidelift','birddog','deadbug','pelvictilt','clamshell','wallsit','openbook','cool']),
    4:planBlock('Strength B',34,['march','wallangel','wallpush','kneepush','hinge','stepup','squat','calf','bridge','cool']),
    5:planBlock('Balance and control',33,['march','chair','sidelift','birddog','clamshell','wallsit','squat','lunge','balance','cool']),
    6:planBlock('Full body',36,['march','wallpush','inclinepush','hinge','stepup','squat','lunge','calf','proney','deadbug','cool']),
  }
};
const STAGE_NAMES={1:'Starter',2:'Medium',3:'Hard'};
const STAGE_NEEDS={1:{sessions:6,days:7},2:{sessions:36,weeks:12},3:{sessions:0,weeks:0}};

let db={};
try{db=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){db={}}
let profile=initProfile();
let activeId=null,repValue=0,exTimer=null,restTick=null,timerDone=false,restNextAction='',restFromId='';
let vaultDates=new Set();
let currentView='home';
let calendarMonth=null;
let homePlanSlide=0;
let vaultFilePicker=false,vaultPreviewData='',selectedVaultFiles=[];
let vaultMeta={configured:false,unlocked:false};
function hasVaultPhoto(k){return vaultDates.has(k)}

function dayISO(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function trainingDate(now=new Date()){let d=new Date(now);if(d.getHours()<4)d.setDate(d.getDate()-1);d.setHours(12,0,0,0);return d}
function dayKey(){return dayISO(trainingDate())}
function parseDay(k){return new Date(k+'T12:00:00')}
function addDays(k,n){let d=parseDay(k);d.setDate(d.getDate()+n);return dayISO(d)}
function weekday(k=dayKey()){return parseDay(k).getDay()}
function mondayOf(k){let d=parseDay(k),off=(d.getDay()+6)%7;d.setDate(d.getDate()-off);return dayISO(d)}
function pretty(k,opt){return parseDay(k).toLocaleDateString('en-IN',opt)}
function daysBetween(a,b){return Math.max(0,Math.floor((parseDay(b)-parseDay(a))/DAY))}

function saveDB(){try{localStorage.setItem(STORE,JSON.stringify(db))}catch(e){toast('Could not save. Storage may be full.')}}
function saveProfile(){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))}catch(e){toast('Could not save profile.')}}
function saveActive(value){try{if(value)localStorage.setItem(ACTIVE_KEY,JSON.stringify({...value,day:dayKey()}));else localStorage.removeItem(ACTIVE_KEY)}catch(e){}}
function readActive(){try{return JSON.parse(localStorage.getItem(ACTIVE_KEY)||'null')}catch(e){return null}}
function initProfile(){
  let p={};
  try{p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')||{}}catch(e){p={}}
  const today=dayKey();
  if(!p.v2Start){
    const keys=Object.keys(db).sort();
    p.dayOne=keys[0]||today;
    p.v2Start=db[today]?addDays(today,1):today;
    p.stage=1;
    p.stageStartedAt=p.v2Start;
    p.stageHistory=[{stage:1,startedAt:p.v2Start}];
    p.makeup={};
    p.weightKg=null;
  }
  if(!p.dayOne)p.dayOne=today;
  if(!p.v2Start)p.v2Start=today;
  if(!p.stage)p.stage=1;
  if(!p.stageStartedAt)p.stageStartedAt=p.v2Start;
  if(!Array.isArray(p.stageHistory)||!p.stageHistory.length)p.stageHistory=[{stage:p.stage,startedAt:p.stageStartedAt}];
  if(!p.makeup||typeof p.makeup!=='object')p.makeup={};
  if(typeof p.weightKg==='undefined')p.weightKg=null;
  if(!p.weightHistory||typeof p.weightHistory!=='object')p.weightHistory={};
  if(!p.waterGoal)p.waterGoal=2000;
  if(!p.proteinGoal)p.proteinGoal=60;
  if(typeof p.spotifyPlaylist!=='string')p.spotifyPlaylist='';
  p.scheduleVersion=2;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p))}catch(e){}
  try{if(Object.keys(db).length&&!localStorage.getItem(BACKUP_KEY))localStorage.setItem(BACKUP_KEY,JSON.stringify(db))}catch(e){}
  return p;
}

function planSnapshot(p){return {title:p.title,time:p.time,mins:p.mins,ids:(p.ids||[]).slice(),stage:p.stage||null}}
function record(k=dayKey()){
  if(!db[k]){
    const p=dayPlan(k);
    db[k]={sessionStart:null,sessionEnd:null,done:[],events:{},status:'not-started',planSnapshot:planSnapshot(p)};
  }else if(!db[k].planSnapshot&&k<=dayKey()){
    const p=dayPlan(k);
    db[k].planSnapshot=planSnapshot(p);
  }
  return db[k];
}
function EX(id){return E[id]||LEGACY_E[id]||null}
function stageAt(k=dayKey()){
  const hist=(profile.stageHistory||[]).slice().sort((a,b)=>a.startedAt.localeCompare(b.startedAt));
  let s=1;
  for(const h of hist)if(h.startedAt<=k)s=h.stage;
  return s;
}
function stageRoot(s,k=dayKey()){
  let at=profile.v2Start;
  (profile.stageHistory||[]).slice().sort((a,b)=>a.startedAt.localeCompare(b.startedAt)).forEach(h=>{if(h.stage===s&&h.startedAt<=k)at=h.startedAt});
  return at;
}
function pendingStage(){
  const today=dayKey();
  return (profile.stageHistory||[]).filter(h=>h.startedAt>today).sort((a,b)=>a.startedAt.localeCompare(b.startedAt))[0]||null;
}
function legacyPlan(wd){
  const p=WEEK_V1[wd];
  return {...p,stage:1,legacy:true,exercises:p.ids.map(id=>({id}))};
}
function dayPlan(k){
  if(k<profile.v2Start)return legacyPlan(weekday(k));
  if(weekday(k)===1){
    const mk=(profile.makeup||{})[mondayOf(k)];
    if(mk&&mk!==k)return dayPlan(mk);
  }
  const stage=stageAt(k);
  const p=(PROGRAMS[stage]&&PROGRAMS[stage][weekday(k)])||PROGRAMS[1][weekday(k)]||PROGRAMS[1][0];
  return {...p,stage,exercises:(p.ids||[]).map(id=>({id}))};
}
function calendarPlan(k){
  const saved=db[k]&&db[k].planSnapshot;
  if(saved&&Array.isArray(saved.ids)&&typeof saved.title==='string')return {...saved,exercises:saved.ids.map(id=>({id}))};
  return dayPlan(k);
}
function plan(){return dayPlan(dayKey())}
function planStage(){const p=plan();return p.stage||stageAt(dayKey())}
function isDayComplete(k){
  const p=calendarPlan(k),r=db[k];
  return !!(p.ids&&p.ids.length&&r&&p.ids.every(id=>(r.done||[]).includes(id)));
}
function repTarget(rx){return rx.eachSide?rx.reps*2:rx.reps}
function rxFor(e,stage){
  if(!e)return {sets:1,reps:0,seconds:0,restSet:20,restNext:30,eachSide:false};
  const prog=e.group==='Strength'||e.group==='Core';
  let sets=prog?(stage===1?1:stage===2?2:3):(e.sets||1);
  if(e.group==='Balance')sets=e.sets||2;
  let reps=e.reps||0;
  let seconds=e.seconds||0;
  if(prog){if(reps)reps+=Math.max(0,(stage-1)*2);if(seconds)seconds+=Math.max(0,(stage-1)*5)}
  return {sets,reps,seconds,restSet:e.restSet??e.rest??20,restNext:e.restNext??e.rest??30,eachSide:!!e.eachSide};
}
function formatRx(e,rx){
  const bits=[];
  if(rx.sets>1)bits.push(rx.sets+' sets');
  if(rx.reps)bits.push(rx.reps+' reps'+(rx.eachSide?' each side':''));
  if(rx.seconds)bits.push((rx.seconds>=60?Math.round(rx.seconds/60*10)/10+' min':rx.seconds+' sec')+(rx.eachSide?' each side':''));
  if(!bits.length)bits.push('1 set');
  return bits.join(' · ');
}
function completedCount(){return Object.keys(db).filter(k=>isDayComplete(k)).length}
function completedSince(start){let n=0;for(let k=start;k<=dayKey();k=addDays(k,1))if(isDayComplete(k))n++;return n}
function streak(){return completedCount()}
function monthCount(){
  const t=trainingDate(),y=t.getFullYear(),m=t.getMonth(),last=new Date(y,m+1,0).getDate();
  let done=0,scheduled=0;
  for(let n=1;n<=last;n++){
    const k=dayISO(new Date(y,m,n));
    if(k>dayKey())continue;
    if(k<profile.dayOne)continue;
    const p=dayPlan(k);
    if(p.ids.length){scheduled++;if(isDayComplete(k))done++}
  }
  return {done,scheduled};
}
function activityForDay(k){
  const p=calendarPlan(k),done=isDayComplete(k),photo=hasVaultPhoto(k);
  if(done)return {label:'WORKOUT',className:'activity-workout',title:'Completed workout'};
  if(photo)return {label:'PHOTO TAKEN',className:'activity-photo',title:'Photo saved · no completed workout'};
  if(k<profile.dayOne)return {label:'NO ACTIVITY',className:'activity-none',title:'No activity recorded'};
  if(!p.ids.length)return {label:'REST',className:'activity-rest',title:'Rest day'};
  if(k>dayKey())return {label:'PLANNED',className:'activity-planned',title:'Future planned workout'};
  if(k<dayKey())return {label:'MISSED',className:'activity-missed',title:'Scheduled workout not completed'};
  return {label:'WORKOUT',className:'activity-workout',title:'Planned workout · not completed'};
}
function timeString(x){return x?new Date(x).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'—'}
function durationString(a,b){if(!a||!b)return '—';let s=Math.max(0,Math.floor((new Date(b)-new Date(a))/1000));return Math.floor(s/60)+'m '+String(s%60).padStart(2,'0')+'s'}
function fmt(sec){return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3200)}
function relocateRedesignPanels(){
  const move=(id,target)=>{
    const node=$(id),parent=$(target);
    if(node&&parent&&typeof parent.appendChild==='function')parent.appendChild(node);
  };
  move('stagePanel','progressContent');
  move('dailyGuide','recoveryContent');
  move('makeupPanel','recoveryContent');
  move('nutritionPanel','nutritionContent');
  move('timetablePanel','nutritionContent');
  move('foodPanel','nutritionContent');
  move('spotifyPanel','musicContent');
}
function show(id){
  if(currentView==='streak'&&id!=='streak'){
    clearCalendarPhoto();
    const api=vaultApi();
    if(api&&vaultMeta.unlocked)api.lock().catch(()=>{});
    vaultMeta={configured:!!vaultMeta.configured,unlocked:false};
  }
  if(currentView==='vault'&&id!=='vault')lockVault();
  closeNavigationMenu();
  currentView=id;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const el=$(id);if(!el)return;
  el.classList.add('active');
  document.querySelectorAll('[data-nav-view]').forEach(button=>{
    const active=button.dataset.navView===id;
    button.classList.toggle('active',active);
    button.setAttribute('aria-current',active?'page':'false');
  });
  if(id==='home')renderHome();
  if(id==='vault')renderVault();
  if(id==='backup')renderBackup();
  if(id==='workout')renderWorkout();
  if(id==='calories')renderCalories();
  if(id==='streak')renderStreak();
  if(id==='routine')renderRoutine();
  if(id==='settings')renderSettings();
  if(id==='recovery'){renderDailyGuide(isDayComplete(dayKey()),plan());renderMakeup(makeupCandidates())}
  if(id==='nutrition')renderNutrition();
  if(id==='music')renderSpotify();
  if(id==='progress'){
    $('progressStreak').textContent=streak();
    $('progressCompleted').textContent=completedCount();
    $('progressMonth').textContent=monthCount().done+'/'+monthCount().scheduled;
    renderStage();
  }
  window.scrollTo(0,0);
}
function showHome(){show('home')}
function openSettings(){show('settings')}
function closeNavigationMenu(){
  const panel=$('navigationMenu'),toggle=$('menuToggle');
  if(panel)panel.hidden=true;
  if(toggle){
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation menu');
  }
}
function toggleNavigationMenu(){
  const panel=$('navigationMenu'),toggle=$('menuToggle');
  if(!panel||!toggle)return;
  panel.hidden=!panel.hidden;
  const expanded=!panel.hidden;
  toggle.setAttribute('aria-expanded',String(expanded));
  toggle.setAttribute('aria-label',expanded?'Close navigation menu':'Open navigation menu');
}
function openStreak(){show('streak')}
function openRoutine(){show('routine')}
function openVault(){show('vault')}
function openBackup(){show('backup')}

const MET_BY_EXERCISE={
  march:3.5,wallangel:2.8,chair:3.5,wallpush:3.5,inclinepush:3.8,kneepush:4.0,hinge:3.5,
  bridge:3.5,calf:3.5,sidelift:3.0,birddog:3.0,deadbug:2.8,pelvictilt:2.5,clamshell:2.8,
  wallsit:3.5,stepup:4.0,squat:4.0,lunge:4.0,proney:2.8,openbook:2.5,
  hipflexorstretch:2.3,hamstringstretch:2.3,balance:2.5,cool:2.5,
  walk:3.0,mobility:2.5,side:3.0
};
const REP_SECONDS=3;
function weightForDay(k){
  const hist=profile.weightHistory||{},all=Object.keys(hist).sort(),keys=all.filter(d=>d<=k);
  if(keys.length)return Number(hist[keys[keys.length-1]])||0;
  if(all.length)return Number(hist[all[0]])||0;
  return Number(profile.weightKg)||0;
}
function workSecondsFor(id,ev,stage){
  const e=EX(id);
  if(!e)return 0;
  const rx=rxFor(e,stage);
  const logged=(ev&&Array.isArray(ev.setLogs))?ev.setLogs.length:0;
  const recorded=Math.max(0,Number(ev&&ev.setsCompleted)||0,logged);
  const sets=Math.min(rx.sets,recorded);
  const perSet=rx.seconds||(rx.reps?repTarget(rx)*REP_SECONDS:0);
  return sets*perSet;
}
function caloriesForDay(k){
  const p=dayPlan(k),r=db[k],stage=p.stage||stageAt(k),kg=weightForDay(k);
  if(!p.ids.length)return {kcal:0,minutes:0,kg,items:[],note:'Rest day. No workout estimate.'};
  let kcal=0,seconds=0;
  const items=[];
  p.ids.forEach(id=>{
    const e=EX(id);
    if(!e)return;
    const sec=workSecondsFor(id,r&&r.events&&r.events[id],stage);
    if(!sec)return;
    const mins=sec/60,met=MET_BY_EXERCISE[id]||3.5;
    const itemKcal=kg?((met-1)*3.5*kg*mins)/200:0;
    kcal+=itemKcal;seconds+=sec;
    items.push({id,name:e.name,minutes:mins,met,kcal:itemKcal});
  });
  const minutes=seconds/60;
  return {kcal:Math.round(kcal),minutes:Math.round(minutes*10)/10,kg,items,note:minutes?'Recorded exercise work only.':'No completed exercise recorded yet.'};
}
function calories(){
  const d=caloriesForDay(dayKey());
  if(!d.minutes)return {text:d.items.length?'0 kcal':'0 kcal',note:d.note};
  if(!d.kg)return {text:'SET WEIGHT',note:'Add body weight in Settings to calculate this estimate.'};
  return {text:'~'+d.kcal+' kcal',note:'Estimate only · '+d.minutes+' active min'};
}
function totalCalories(){
  let kcal=0,minutes=0,days=0,sessions=0;
  Object.keys(db).sort().forEach(k=>{
    const d=caloriesForDay(k);
    if(d.minutes){days++;sessions++}
    if(d.minutes&&d.kg){kcal+=d.kcal;minutes+=d.minutes}
  });
  return {kcal:Math.round(kcal),minutes:Math.round(minutes),days,sessions};
}
function calorieHistory(){
  const today=dayKey();
  return Array.from({length:14},(_,i)=>addDays(today,-i)).map(k=>{
    const d=caloriesForDay(k),r=db[k],p=dayPlan(k);
    return {k,d,title:p.ids.length?p.title:'Rest and recovery',recorded:!!(r&&r.events&&Object.keys(r.events).length)};
  });
}
function renderCalories(){
  const k=dayKey(),d=caloriesForDay(k),all=totalCalories();
  $('calorieDate').textContent=pretty(k,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();
  $('calorieToday').textContent=d.kg&&d.minutes?'~'+d.kcal+' kcal':d.kg?'0 kcal':'SET WEIGHT';
  $('calorieActive').textContent=d.minutes+' min';
  $('calorieTotal').textContent=all.kcal+' kcal';
  $('calorieSessions').textContent=all.sessions+' sessions';
  $('calorieTotalActive').textContent=all.minutes+' min';
  $('calorieDays').textContent=all.days+' days';
  $('calorieDayNote').textContent=!d.kg?'Add body weight in Settings. Old days use the latest weight saved on or before that date; if none exists, the earliest weight ever saved is used.':d.note;
  $('calorieBreakdown').innerHTML=d.items.length?d.items.map(i=>'<div class="nutritionRow"><div><b>'+i.name+'</b><small>'+i.minutes+' min · MET '+i.met+'</small></div><b>'+(d.kg?'~'+Math.round(i.kcal)+' kcal':'—')+'</b></div>').join(''):'<p class="smallNote">No completed exercise work is recorded for this training day yet.</p>';
  $('calorieHistory').innerHTML=calorieHistory().map(row=>{
    const kcal=row.d.kg&&row.d.minutes?'~'+row.d.kcal+' kcal':row.d.minutes?'WEIGHT NEEDED':'0 kcal';
    return '<div class="historyItem"><div><b>'+pretty(row.k,{weekday:'short',day:'numeric',month:'short'})+'</b><small>'+(row.recorded?row.title:'No workout recorded')+'</small></div><div><b>'+kcal+'</b><small>'+row.d.minutes+' active min</small></div></div>';
  }).join('');
}
function openCalories(){renderCalories();show('calories')}
function nutritionFor(k=dayKey()){
  const r=db[k];
  return {water:Number(r&&r.waterMl)||0,protein:Number(r&&r.proteinG)||0};
}
function renderNutrition(){
  const k=dayKey(),n=nutritionFor(k),wg=Number(profile.waterGoal)||2000,pg=Number(profile.proteinGoal)||60;
  $('waterValue').textContent=n.water+' / '+wg+' ml';
  $('proteinValue').textContent=n.protein+' / '+pg+' g';
  $('waterBar').style.width=Math.min(100,Math.round(n.water/wg*100))+'%';
  $('proteinBar').style.width=Math.min(100,Math.round(n.protein/pg*100))+'%';
  if(document.activeElement!==$('waterGoalInput'))$('waterGoalInput').value=wg;
  if(document.activeElement!==$('proteinGoalInput'))$('proteinGoalInput').value=pg;
}
function adjustWater(delta){
  const k=dayKey(),r=record(),n=nutritionFor(k);
  r.waterMl=Math.max(0,Math.min(10000,n.water+delta));
  saveDB();renderNutrition();
}
function adjustProtein(delta){
  const k=dayKey(),r=record(),n=nutritionFor(k);
  r.proteinG=Math.max(0,Math.min(400,n.protein+delta));
  saveDB();renderNutrition();
}
function saveNutritionTargets(){
  const wg=Number($('waterGoalInput').value),pg=Number($('proteinGoalInput').value);
  if(!isFinite(wg)||wg<500||wg>8000){toast('Water target: 500–8000 ml.');return}
  if(!isFinite(pg)||pg<10||pg>300){toast('Protein target: 10–300 g.');return}
  profile.waterGoal=Math.round(wg);profile.proteinGoal=Math.round(pg);
  saveProfile();renderNutrition();toast('Daily targets saved.');
}
let selectedHomePlanKey=null;
function selectHomePlan(k){
  selectedHomePlanKey=k;
  homePlanSlide=0;
  renderHomePlanCard();
  $('homePlanCard').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function renderWeekStrip(){
  const start=dayKey();
  $('weekStrip').innerHTML=Array.from({length:3},(_,i)=>{
    const k=addDays(start,i),p=dayPlan(k),activity=activityForDay(k),today=k===start;
    return '<button type="button" class="weekDay '+activity.className+(today?' today':'')+'" data-home-plan-date="'+k+'" aria-label="View '+pretty(k,{weekday:'long',day:'numeric',month:'long'})+' plan"><small>'+pretty(k,{weekday:'short'}).toUpperCase()+'</small><b>'+pretty(k,{day:'numeric'})+'</b><span>'+activity.label+'</span><em title="'+p.title+'">'+p.title+'</em></button>';
  }).join('');
  const strip=$('weekStrip');
  if(strip&&typeof strip.querySelectorAll==='function')strip.querySelectorAll('[data-home-plan-date]').forEach(card=>card.onclick=()=>selectHomePlan(card.dataset.homePlanDate));
}
function makeupCandidates(){
  const k=dayKey();
  if(weekday(k)!==1||k<profile.v2Start)return [];
  const out=[];
  for(let d=addDays(k,-6);d<k;d=addDays(d,1)){
    if(d<profile.v2Start)continue;
    const p=dayPlan(d);
    if(p.ids.length&&!isDayComplete(d))out.push({k:d,p});
  }
  return out;
}
function live(){
  const n=new Date(),d=trainingDate(),p=plan(),k=dayKey();
  $('weekday').textContent=d.toLocaleDateString('en-IN',{weekday:'long'}).toUpperCase();
  $('dateLine').textContent=d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  $('liveClock').innerHTML=n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})+' <small>'+n.toLocaleTimeString('en-IN',{hour:'2-digit',hour12:true}).slice(-2).toUpperCase()+'</small>';
  const mins=n.getHours()*60+n.getMinutes();
  const has=p.ids.length>0;
  let hint='';
  if(!has)hint=weekday(k)===1?'REST DAY · MONDAY MAKE-UP SLOT':'REST DAY · RECOVERY';
  else if(mins>=240&&mins<300)hint='WORKOUT WINDOW OPEN · FINISH BY 05:30';
  else if(mins>=300&&mins<330)hint='WORKOUT WINDOW · FINISH BY 05:30';
  else if(mins<240)hint='TRAINING DAY CLOSES AT 04:00 AM';
  else hint='SESSION WINDOW PASSED · START WHEN READY';
  $('countdown').textContent=hint;
  let pct=0;
  if(has){if(mins<=240)pct=0;else if(mins>=330)pct=100;else pct=Math.round((mins-240)/90*100)}
  $('liveFill').style.width=pct+'%';
}
function renderHome(){
  live();
  const k=dayKey(),p=plan(),r=record(),complete=isDayComplete(k),cands=makeupCandidates();
  const activity=activityForDay(k);
  const preview=p.ids.length?p.ids.map(id=>EX(id)?.name||id).join(' · '):'No workout scheduled. Recovery is part of the plan.';
  $('todayStatus').textContent=activity.label;
  $('todayStatus').className='tag '+activity.className;
  $('todayStatus').title=activity.title;
  $('planName').textContent=p.ids.length?p.title:weekday(k)===1?'Rest and make-up':'Rest and reset';
  $('planTime').textContent=p.ids.length?'04:00–05:30 AM':'RECOVERY';
  $('durationTag').textContent=p.mins?p.mins+' MIN':'REST';
  $('exercisePreview').textContent=preview;
  const doneCount=p.ids.filter(id=>(r.done||[]).includes(id)).length;
  const progress=p.ids.length?Math.min(doneCount,p.ids.length):0;
  $('workoutProgress').textContent=p.ids.length?(complete?'ALL '+p.ids.length+' EXERCISES COMPLETE':progress+' / '+p.ids.length+' EXERCISES · '+Math.round(progress/p.ids.length*100)+'%'):'RECOVERY DAY';
  $('startToday').textContent=complete?'VIEW COMPLETED SESSION':r.sessionStart?'CONTINUE WORKOUT':p.ids.length?'START TODAY':cands.length?'CHOOSE MAKE-UP':'VIEW REST DAY';
  const streakValue=streak();
  $('streakCount').textContent=streakValue+' '+(streakValue===1?'day':'days');
  const streakButton=$('openStreak');
  if(streakButton){
    streakButton.innerHTML='<span class="streakLabel">STREAK | </span><span class="streakValue">'+String(streakValue).padStart(2,'0')+(streakValue===1?' DAY':' DAYS')+'</span>';
    streakButton.classList.remove('streakPulse');
    void streakButton.offsetWidth;
    streakButton.classList.add('streakPulse');
  }
  $('completedCount').textContent=completedCount();
  const dateElement=$('dateLine');
  if(dateElement){
    dateElement.classList.remove('dateFade');
    void dateElement.offsetWidth;
    dateElement.classList.add('dateFade');
  }
  const m=monthCount();$('monthProgress').textContent=m.done+'/'+m.scheduled;
  const cal=calories();$('calorieEstimate').textContent=cal.text;$('calorieNote').textContent=cal.note;
  renderStage();
  renderMakeup(cands);
  renderDailyGuide(complete,p);
  renderWeekStrip();
  renderHomePlanCard();
  renderNutrition();
  renderSpotify();
}
function nextScheduledDay(){
  const today=dayKey();
  for(let i=1;i<=7;i++){
    const k=addDays(today,i);
    if(dayPlan(k).ids.length)return k;
  }
  return addDays(today,1);
}
function renderHomePlanCard(){
  const k=selectedHomePlanKey||(homePlanSlide?nextScheduledDay():dayKey()),p=dayPlan(k),today=k===dayKey();
  const title=p.ids.length?p.title:(weekday(k)===1?'Rest and make-up':'Rest and reset');
  const names=p.ids.length?p.ids.map(id=>EX(id)?.name||id).join(' · '):'No workout scheduled. Recovery is part of the plan.';
  $('homePlanLabel').textContent=today?"TODAY'S PLAN":'SELECTED PLAN';
  $('homePlanTitle').textContent=title;
  $('homePlanDate').textContent=today?'TODAY':pretty(k,{weekday:'short',day:'numeric',month:'short'}).toUpperCase();
  $('homePlanMeta').textContent=p.ids.length?(p.mins+' MIN · '+p.ids.length+' EXERCISES'):'RECOVERY DAY';
  $('homePlanExercises').textContent=names;
  $('homePlanDotToday').classList.toggle('active',!homePlanSlide);
  $('homePlanDotUpcoming').classList.toggle('active',!!homePlanSlide);
}
function swipeHomePlan(delta){
  if(delta>30){selectedHomePlanKey=null;homePlanSlide=1;renderHomePlanCard()}
  else if(delta<-30){selectedHomePlanKey=null;homePlanSlide=0;renderHomePlanCard()}
}
function renderDailyGuide(complete,p){
  const k=dayKey();
  if(complete){
    $('dailyGuideLabel').textContent='TODAY COMPLETED · RECOVERY GUIDE';
    $('dailyGuideTitle').textContent='Recover, eat, and protect sleep.';
    $('dailyGuideBody').textContent='Water and a normal meal with protein. Keep the rest of the day easy. Do not add a second workout. Your next planned session is on the next training day after the 04:00 reset.';
    return;
  }
  if(p.ids.length){
    $('dailyGuideLabel').textContent='WORKOUT NOT COMPLETED · REST-DAY GUIDE';
    $('dailyGuideTitle').textContent='If you do not train today, rest without guilt.';
    $('dailyGuideBody').textContent='No session is recorded yet. Do not double up later. Monday is the only make-up slot for this training week. Use normal meals, water, gentle movement only if comfortable, and sleep.';
    return;
  }
  $('dailyGuideLabel').textContent=weekday(k)===1?'REST DAY · MONDAY':'REST DAY · RECOVERY GUIDE';
  $('dailyGuideTitle').textContent='No workout today.';
  $('dailyGuideBody').textContent=weekday(k)===1?'Monday is rest or the one make-up slot for a missed session. If there is nothing to make up, keep the day easy and return to the next planned session.':'Nothing is required today. Normal meals, water, gentle movement if comfortable, and sleep. The plan resumes on the next training day.';
}
function renderStage(){
  const stage=stageAt(dayKey()),start=stageRoot(stage),cnt=completedSince(start),days=daysBetween(start,dayKey())+1;
  const weeks=Math.floor((days-1)/7);
  const pend=pendingStage();
  $('stageName').textContent=STAGE_NAMES[stage];
  $('stageBadge').textContent='STAGE '+stage+' / 3';
  const need=STAGE_NEEDS[stage];
  if(stage===1){
    $('stageProgress').textContent=cnt+' / '+need.sessions+' sessions · '+Math.min(weeks,1)+' / 1 week';
    $('stageBar').style.width=Math.min(100,Math.round((cnt/need.sessions)*100))+'%';
    $('stageHint').textContent='Complete at least 6 controlled sessions across 7 days. Progress is manual, so the app will not move you automatically.';
  }else if(stage===2){
    $('stageProgress').textContent=cnt+' / '+need.sessions+' sessions · '+weeks+' / '+need.weeks+' weeks';
    $('stageBar').style.width=Math.min(100,Math.round((weeks/need.weeks)*100))+'%';
    $('stageHint').textContent='Stay here for at least 12 weeks. Move on only when you can finish every session with controlled form and no worsening pain.';
  }else{
    $('stageProgress').textContent=cnt+' sessions completed in this stage';
    $('stageBar').style.width='100%';
    $('stageHint').textContent='Advanced stage. Stay only while recovery, sleep, and form remain good. No automatic progression.';
  }
  const can=stage<3&&!pend&&((stage===1&&cnt>=6&&days>=7)||(stage===2&&cnt>=36&&weeks>=12));
  $('advanceStage').classList.toggle('hidden',stage>=3);
  $('advanceStage').disabled=!can;
  $('advanceStage').textContent=pend?'NEXT STAGE STARTS '+pretty(pend.startedAt,{day:'numeric',month:'short'}).toUpperCase():can?'MOVE TO '+STAGE_NAMES[stage+1].toUpperCase():'KEEP TRAINING';
  $('stageDayOne').textContent='Day 1 · '+pretty(profile.dayOne,{day:'numeric',month:'short',year:'numeric'})+(pend?' · '+STAGE_NAMES[pend.stage]+' begins next day.':'');
}
function renderMakeup(cands){
  const k=dayKey(),panel=$('makeupPanel'),sel=(profile.makeup||{})[mondayOf(k)];
  panel.classList.toggle('hidden',!(weekday(k)===1&&k>=profile.v2Start));
  if(weekday(k)!==1||k<profile.v2Start)return;
  if(sel&&!isDayComplete(k)){
    const p=dayPlan(sel);
    $('makeupIntro').textContent='Make-up selected: '+pretty(sel,{weekday:'short',day:'numeric',month:'short'})+' · '+p.title+'. Only one missed session can be made up.';
    $('makeupSelect').innerHTML='<option value="'+sel+'">'+pretty(sel,{weekday:'long',day:'numeric',month:'long'})+' · '+p.title+'</option>';
    $('makeupSelect').disabled=true;
    $('startMakeup').textContent=record().sessionStart?'CONTINUE MAKE-UP':'START MAKE-UP';
    return;
  }
  if(isDayComplete(k)||!cands.length){panel.classList.add('hidden');return}
  $('makeupIntro').textContent='Choose one missed session from Tuesday to Sunday. It will be recorded on this Monday only.';
  $('makeupSelect').disabled=false;
  $('makeupSelect').innerHTML=cands.map(c=>'<option value="'+c.k+'">'+pretty(c.k,{weekday:'long',day:'numeric',month:'short'})+' · '+c.p.title+'</option>').join('');
  $('startMakeup').textContent='START MAKE-UP';
}
function renderWorkout(){
  const k=dayKey(),p=plan(),r=record(),stage=p.stage||stageAt(k);
  $('workoutDay').textContent=pretty(k,{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
  $('workoutTitle').textContent=p.ids.length?p.title:weekday(k)===1?'Rest and make-up':'Rest and reset';
  $('workoutIntro').textContent=p.ids.length?p.ids.length+' exercises · '+p.mins+' minutes planned · Complete the warm-up first and the cool-down last.':'No workout is scheduled. Recovery is part of the plan.';
  if(!p.ids.length){
    $('exerciseCards').innerHTML='<div class="panel solid"><h3>Rest day</h3><p>No workout is scheduled. Monday is the one make-up slot for a missed session in this training week.</p><button class="secondaryBtn" onclick="showHome()">BACK TO TODAY</button></div>';
    return;
  }
  $('exerciseCards').innerHTML=p.ids.map((id,i)=>{
    const e=EX(id);if(!e)return '';
    const rx=rxFor(e,stage),ev=r.events[id],done=r.done.includes(id),im=e.photo?images[e.photo]:null;
    const photo=im?'<img class="cardPhoto" src="'+im.url+'" alt="'+im.alt+'" loading="lazy" onerror="this.remove()">':'';
    const credit=im?'<a class="photoSource" href="'+im.link+'" target="_blank" rel="noopener">Photo: '+im.source+'</a>':'<span class="photoSource">Stored guidance</span>';
    return '<article class="exerciseCard"><div class="exerciseMain'+(im?'':' noPhoto')+'">'+photo+'<div class="cardBody"><div class="exNum">EXERCISE '+String(i+1).padStart(2,'0')+' / '+p.ids.length+'</div><div class="exName">'+e.name+'</div><div class="exFocus">'+e.focus+'</div><div class="exDescription">'+e.steps[0]+'</div><div class="exMeta"><span>'+formatRx(e,rx)+'</span><span>Rest '+rx.restSet+' sec</span><span>'+rx.sets+' set'+(rx.sets===1?'':'s')+'</span></div></div></div><div class="cardBottom">'+credit+'<button class="startExBtn '+(done?'done':'')+'" data-id="'+id+'" '+(done?'disabled':'')+'>'+(done?'COMPLETED':ev&&ev.startedAt?'CONTINUE':'START EXERCISE')+'</button></div>'+(ev?'<div style="padding:0 12px 10px;color:var(--muted);font-size:9px">Started '+timeString(ev.startedAt)+'</div>':'')+'</article>';
  }).join('');
  $('exerciseCards').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openExercise(b.dataset.id));
}
function startToday(){
  const k=dayKey(),p=plan(),cands=makeupCandidates(),r=record();
  if(!p.ids.length){
    if(cands.length){$('makeupPanel').scrollIntoView({block:'center'});toast('Choose a missed session first.');return}
    renderWorkout();show('workout');return;
  }
  if(isDayComplete(k)){showFinished();return}
  if(!r.sessionStart){r.sessionStart=new Date().toISOString();r.status='in-progress';saveDB()}
  const next=p.exercises.find(x=>!r.done.includes(x.id));
  if(next)openExercise(next.id);else showFinished();
}
function ensureEv(id){
  const r=record();
  if(!r.events[id])r.events[id]={};
  const ev=r.events[id];
  if(!ev.startedAt)ev.startedAt=new Date().toISOString();
  if(!Array.isArray(ev.setLogs))ev.setLogs=[];
  if(typeof ev.setsCompleted!=='number')ev.setsCompleted=r.done.includes(id)?1:0;
  if(typeof ev.currentReps!=='number')ev.currentReps=ev.repCount||0;
  return ev;
}
function openExercise(id){
  const e=EX(id);if(!e)return;
  const r=record();
  if(!r.sessionStart){r.sessionStart=new Date().toISOString();r.status='in-progress'}
  const ev=ensureEv(id);
  activeId=id;repValue=ev.currentReps||0;timerDone=!!(ev.timerEndsAt&&ev.timerEndsAt<=Date.now());
  clearExerciseTimer();clearRest();
  saveDB();
  saveActive({id,mode:'exercise',at:Date.now()});
  renderExercise();
  if(ev.timerEndsAt&&ev.timerEndsAt>Date.now())resumeSetTimer(ev.timerEndsAt);
  show('exercise');
}
function restoreActiveSession(){
  const a=readActive();
  if(!a||!a.id||a.day!==dayKey()||!EX(a.id)||isDayComplete(dayKey())){saveActive(null);return false}
  if(a.mode==='rest'&&a.fromId){
    activeId=a.id;
    repValue=ensureEv(a.id).currentReps||0;
    clearExerciseTimer();clearRest();
    renderExercise();
    const remaining=Math.max(0,Math.ceil(((a.restEndsAt||0)-Date.now())/1000));
    startRest(remaining,a.next,a.fromId);
    show('exercise');
    return true;
  }
  openExercise(a.id);
  return true;
}
function renderExercise(){
  if(!activeId)return;
  const e=EX(activeId),k=dayKey(),p=plan(),stage=p.stage||stageAt(k),rx=rxFor(e,stage),r=record(),ev=ensureEv(activeId),im=e.photo?images[e.photo]:null;
  const idx=p.ids.indexOf(activeId);
  $('exercisePosition').textContent='EXERCISE '+String(idx+1).padStart(2,'0')+' / '+p.ids.length;
  $('focusGroup').textContent=e.focus.toUpperCase();
  $('focusName').textContent=e.name;
  $('focusMeta').innerHTML='<span class="chip">'+formatRx(e,rx)+'</span><span class="chip">Rest '+rx.restSet+' sec between sets</span><span class="chip">Stage '+stage+'</span>';
  $('exercisePositionText').textContent=e.position||'Set up in a clear, safe space.';
  $('exerciseSteps').innerHTML='<ol>'+e.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
  $('exercisePosture').textContent=e.posture||'Move slowly and keep the body controlled.';
  $('exerciseBreathing').textContent=e.breathing||'Breathe normally. Do not hold your breath.';
  $('exerciseTip').textContent=e.tip||'Stop if you feel sharp pain, dizziness, or unusual breathlessness.';
  $('exerciseStartedAt').textContent='Exercise started at '+timeString(ev.startedAt);
  if(im){
    $('focusPhotoWrap').classList.remove('hidden');
    $('focusPhoto').src=im.url;
    $('focusPhoto').alt=im.alt;
    $('focusPhoto').onerror=()=>{$('focusPhotoWrap').classList.add('hidden')};
    $('photoCreditLine').classList.remove('hidden');
    $('photoSource').href=im.link;
    $('photoSource').textContent=im.source;
  }else{
    $('focusPhotoWrap').classList.add('hidden');
    $('photoCreditLine').classList.add('hidden');
  }
  const done=r.done.includes(activeId)||ev.setsCompleted>=rx.sets;
  const setNo=Math.min(rx.sets,ev.setsCompleted+1);
  $('setStatus').textContent=done?'EXERCISE COMPLETE':'SET '+setNo+' OF '+rx.sets;
  $('repPanel').classList.toggle('hidden',!rx.reps||!!rx.seconds);
  $('exerciseTimerPanel').classList.toggle('hidden',!rx.seconds);
  $('repValue').textContent=repValue+' / '+repTarget(rx);
  $('repLabel').textContent='REPETITIONS'+(rx.eachSide?' · '+rx.reps+' EACH SIDE':'');
  $('exerciseTimer').textContent=fmt(rx.seconds);
  $('timerHint').textContent=done?'Set recorded.':timerDone?'Time complete. Tap Complete set.':'Press Start timer when ready.';
  $('exerciseWork').classList.remove('hidden');
  $('restPanel').classList.add('hidden');
  const action=$('exerciseAction');
  action.classList.remove('hidden');
  $('exerciseSkip').classList.remove('hidden');
  if(done){
    action.disabled=true;action.textContent='EXERCISE COMPLETE';
  }else if(rx.seconds){
    action.disabled=false;action.textContent=timerDone?'COMPLETE SET':'START TIMER';
  }else{
    action.disabled=repValue<repTarget(rx);action.textContent='COMPLETE SET';
  }
}
function adjustRep(n){
  const e=EX(activeId);if(!e)return;
  const rx=rxFor(e,planStage());
  repValue=Math.max(0,Math.min(99,repValue+n));
  const ev=ensureEv(activeId);ev.currentReps=repValue;saveDB();
  $('repValue').textContent=repValue+' / '+repTarget(rx);
  $('exerciseAction').disabled=repValue<repTarget(rx);
}
function clearExerciseTimer(){if(exTimer){clearInterval(exTimer);exTimer=null}}
function clearRest(){if(restTick){clearInterval(restTick);restTick=null}}
function startSetTimer(){
  if(!activeId)return;
  const e=EX(activeId),rx=rxFor(e,planStage());
  if(exTimer)return;
  const endsAt=Date.now()+rx.seconds*1000;
  const ev=ensureEv(activeId);
  ev.timerEndsAt=endsAt;saveDB();
  saveActive({id:activeId,mode:'exercise',timerEndsAt:endsAt,at:Date.now()});
  resumeSetTimer(endsAt);
}
function resumeSetTimer(endsAt){
  if(!activeId)return;
  clearExerciseTimer();
  timerDone=false;
  $('exerciseAction').disabled=true;$('exerciseAction').textContent='TIMER RUNNING';
  $('timerHint').textContent='Keep the position and breathe.';
  const tick=()=>{
    let sec=Math.ceil((endsAt-Date.now())/1000);
    $('exerciseTimer').textContent=fmt(Math.max(0,sec));
    if(sec<=0){
      clearExerciseTimer();beep();timerDone=true;
      const ev=ensureEv(activeId);ev.timerEndsAt=null;saveDB();
      saveActive({id:activeId,mode:'exercise',at:Date.now()});
      $('exerciseAction').disabled=false;$('exerciseAction').textContent='COMPLETE SET';
      $('timerHint').textContent='Time complete. Tap Complete set.';
    }
  };
  tick();
  exTimer=setInterval(tick,1000);
}
function actionSet(){
  if(!activeId)return;
  const e=EX(activeId),rx=rxFor(e,planStage());
  if(rx.seconds){
    if(exTimer)return;
    if(!timerDone){startSetTimer();return}
  }else if(repValue<repTarget(rx)){
    toast('Count all '+repTarget(rx)+' repetitions first.');return;
  }
  completeSet(e,rx);
}
function completeSet(e,rx){
  const r=record(),ev=ensureEv(activeId),now=new Date().toISOString();
  const set=ev.setsCompleted+1;
  ev.setLogs.push({set,startedAt:ev.startedAt,endedAt:now,reps:repTarget(rx)||0,seconds:rx.seconds||0});
  ev.setsCompleted=set;
  ev.currentReps=0;
  ev.timerEndsAt=null;
  ev.repCount=(ev.repCount||0)+(repTarget(rx)||0);
  ev.restStart=now;
  r.events[activeId]=ev;
  r.sessionStart=r.sessionStart||now;
  r.status='in-progress';
  saveDB();
  repValue=0;timerDone=false;clearExerciseTimer();
  if(set<rx.sets){
    startRest(rx.restSet,'nextSet',activeId);
    return;
  }
  ev.endedAt=now;
  if(!r.done.includes(activeId))r.done.push(activeId);
  saveDB();
  if(plan().ids.every(id=>r.done.includes(id))){
    r.sessionEnd=now;r.status='completed';saveDB();showFinished();
  }else{
    startRest(rx.restNext,'nextExercise',activeId);
  }
}
function nextExerciseName(fromId){
  const p=plan(),r=record(),idx=p.ids.indexOf(fromId);
  for(let i=idx+1;i<p.ids.length;i++)if(!r.done.includes(p.ids[i]))return EX(p.ids[i])?.name||p.ids[i];
  return 'Finish session';
}
function startRest(seconds,next,fromId){
  clearRest();clearExerciseTimer();
  restNextAction=next;restFromId=fromId;
  $('exerciseWork').classList.add('hidden');
  $('restPanel').classList.remove('hidden');
  const r=record(),ev=r.events[fromId]||{};
  const rx=rxFor(EX(fromId),planStage());
  const setDone=ev.setsCompleted||1;
  $('restLabel').textContent=next==='nextSet'?'SET COMPLETE':'EXERCISE COMPLETE';
  $('restHint').textContent=next==='nextSet'?'Rest before set '+Math.min(rx.sets,setDone+1)+' of '+rx.sets+'.':'Next: '+nextExerciseName(fromId)+'. Start only when ready.';
  const endsAt=Date.now()+seconds*1000;
  saveActive({id:fromId,mode:'rest',next,fromId,restEndsAt:endsAt,at:Date.now()});
  let sec=seconds;
  $('restTimer').textContent=fmt(sec);
  const btn=$('continueAfterRest');
  if(sec<=0){
    btn.disabled=false;
    btn.textContent=next==='nextSet'?'START SET '+(setDone+1):'NEXT EXERCISE';
    $('restHint').textContent=next==='nextSet'?'No rest needed. Start the next set when ready.':'No rest needed. Open the next exercise when ready.';
    return;
  }
  btn.disabled=true;btn.textContent='RESTING';
  restTick=setInterval(()=>{
    let left=Math.ceil((endsAt-Date.now())/1000);
    $('restTimer').textContent=fmt(Math.max(0,left));
    if(left<=0){
      clearRest();beep();
      const rr=record(),ee=rr.events[restFromId];
      if(ee)ee.restEnd=new Date().toISOString();
      saveDB();
      saveActive({id:fromId,mode:'exercise',at:Date.now()});
      btn.disabled=false;
      btn.textContent=next==='nextSet'?'START SET '+(setDone+1):'NEXT EXERCISE';
      $('restHint').textContent=next==='nextSet'?'Rest complete. Start the next set when ready.':'Rest complete. Open the next exercise when ready.';
    }
  },1000);
}
function continueRest(){
  const action=restNextAction;
  clearRest();
  $('restPanel').classList.add('hidden');
  if(action==='nextSet'){
    $('exerciseWork').classList.remove('hidden');
    saveActive({id:restFromId,mode:'exercise',at:Date.now()});
    renderExercise();
    return;
  }
  const p=plan(),r=record();
  const next=p.exercises.find(x=>!r.done.includes(x.id));
  if(next)openExercise(next.id);else showFinished();
}
function showFinished(){
  const r=record(),p=plan();
  if(!r.sessionEnd)r.sessionEnd=new Date().toISOString();
  if(r.done.length>=p.ids.length)r.status='completed';
  saveDB();
  saveActive(null);
  $('sumStart').textContent=timeString(r.sessionStart);
  $('sumEnd').textContent=timeString(r.sessionEnd);
  $('sumDuration').textContent=durationString(r.sessionStart,r.sessionEnd);
  $('sumCount').textContent=r.done.length+' / '+p.ids.length;
  $('sumDate').textContent='Saved for '+pretty(dayKey(),{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  renderHome();
  show('finished');
}
function renderStreak(){
  const current=trainingDate();
  if(!calendarMonth)calendarMonth={year:current.getFullYear(),month:current.getMonth()};
  const y=calendarMonth.year,m=calendarMonth.month,first=new Date(y,m,1),last=new Date(y,m+1,0).getDate(),today=dayKey();
  const total=streak();
  $('streakTotal').textContent=total+(total===1?' day':' days');
  $('monthTitle').textContent=first.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  let html=['M','T','W','T','F','S','S'].map(x=>'<div class="calendarCell dow">'+x+'</div>').join('');
  const lead=(first.getDay()+6)%7;
  for(let i=0;i<lead;i++)html+='<div class="calendarCell pre"></div>';
  for(let n=1;n<=last;n++){
    const k=dayISO(new Date(y,m,n)),p=calendarPlan(k),done=isDayComplete(k),photo=hasVaultPhoto(k);
    let state='';
    if(k<profile.dayOne)state='pre';
    else if(done)state='done';
    else if(photo)state='photo';
    else if(p.ids.length&&k<today)state='missed';
    else if(p.ids.length&&k>today)state='planned';
    const title=activityForDay(k).title;
    html+='<button type="button" class="calendarCell '+state+(k===today?' today':'')+'" data-calendar-date="'+k+'" title="'+title+'">'+n+'</button>';
  }
  $('calendar').innerHTML=html;
  $('calendar').querySelectorAll('[data-calendar-date]').forEach(cell=>cell.onclick=()=>selectCalendarDate(cell.dataset.calendarDate));
  const selected=window.selectedCalendarDate;
  const selectedDate=selected?parseDay(selected):null;
  const inViewedMonth=selectedDate&&selectedDate.getFullYear()===y&&selectedDate.getMonth()===m;
  selectCalendarDate(inViewedMonth?selected:dayISO(first));
  const keys=Object.keys(db).sort().reverse().slice(0,20);
  $('historyList').innerHTML=keys.map(k=>{
    const r=db[k],p=calendarPlan(k),done=isDayComplete(k);
    const detail=Object.entries(r.events||{}).map(([id,e])=>'<div class="tinyNote">'+(EX(id)?.name||id)+': '+timeString(e.startedAt)+' to '+timeString(e.endedAt)+'</div>').join('');
    let status='REST DAY';
    if(done)status='COMPLETED';
    else if(p.ids.length&&k<today)status='REST · MISSED WORKOUT';
    else if(p.ids.length&&k===today)status=r.sessionStart?'IN PROGRESS':'NOT STARTED';
    return '<div class="historyItem"><div><b>'+pretty(k,{weekday:'short',day:'numeric',month:'short',year:'numeric'})+'</b><div class="smallNote">'+p.title+'</div>'+detail+'<div class="tinyNote">Session: '+timeString(r.sessionStart)+' to '+timeString(r.sessionEnd)+'</div></div><b>'+status+'</b></div>';
  }).join('')||'<p class="smallNote">Your history will appear here after you start a session.</p>';
}
function shiftCalendarMonth(delta){
  if(!calendarMonth){
    const d=trainingDate();
    calendarMonth={year:d.getFullYear(),month:d.getMonth()};
  }
  const d=new Date(calendarMonth.year,calendarMonth.month+delta,1);
  calendarMonth={year:d.getFullYear(),month:d.getMonth()};
  renderStreak();
}
function showCurrentCalendarMonth(){
  const d=trainingDate();
  calendarMonth={year:d.getFullYear(),month:d.getMonth()};
  window.selectedCalendarDate=dayKey();
  renderStreak();
}
function clearCalendarPhoto(){
  const image=$('calendarPhotoImage');
  if(image){image.removeAttribute('src');image.classList.add('hidden')}
  const wrap=$('calendarPhotoReveal');
  if(wrap)wrap.classList.add('hidden');
  const password=$('calendarPhotoPassword');
  if(password)password.value='';
}
function selectCalendarDate(k){
  if(!k||!$('calendarDateDetail'))return;
  window.selectedCalendarDate=k;
  const p=calendarPlan(k),r=db[k],a=activityForDay(k),photo=hasVaultPhoto(k);
  $('calendarDateTitle').textContent=pretty(k,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  $('calendarDateStatus').textContent=a.label;
  $('calendarDateStatus').className='activityStatus '+a.className;
  $('calendarDatePlan').innerHTML=p.ids.length
    ? '<b>'+p.title+'</b><small>'+p.ids.map(id=>{const e=EX(id);return e?e.name:id}).join(' · ')+'</small>'
    : '<b>'+p.title+'</b><small>Recovery day. No workout is scheduled.</small>';
  $('calendarDateRecord').textContent=r
    ? (isDayComplete(k)?'Completed workout recorded.':r.sessionStart?'Workout started but not completed.':'No completed workout recorded.')
    : k>dayKey()?'Future plan; no activity recorded.':'No activity record saved for this date.';
  $('calendarPhotoDetail').classList.toggle('hidden',!photo);
  clearCalendarPhoto();
  $('calendarPhotoPasswordPanel').classList.toggle('hidden',!photo);
  if(photo){
    $('calendarPhotoMessage').textContent='ENTER PASSWORD TO VIEW';
    $('calendarPhotoPasswordError').textContent='';
  }
}
async function revealCalendarPhoto(){
  const k=window.selectedCalendarDate,api=vaultApi();
  if(!k||!hasVaultPhoto(k)||!api)return;
  try{
    let status=await api.status();
    if(!status.unlocked){
      const password=$('calendarPhotoPassword').value;
      if(!password){$('calendarPhotoPasswordError').textContent='Enter your Photo Vault password.';return}
      status=await api.unlock({password});
    }
    const listed=await api.list(),file=(listed.files||[]).find(item=>item.date===k);
    if(!file)throw new Error('Photo not found.');
    const photo=await api.read({name:file.name});
    $('calendarPhotoImage').src='data:'+photo.mime+';base64,'+photo.data;
    $('calendarPhotoImage').classList.remove('hidden');
    $('calendarPhotoReveal').classList.remove('hidden');
    $('calendarPhotoMessage').textContent='PHOTO UNLOCKED';
    $('calendarPhotoPasswordError').textContent='';
    $('calendarPhotoPassword').value='';
  }catch(e){
    $('calendarPhotoPasswordError').textContent='Incorrect password or photo unavailable.';
    clearCalendarPhoto();
  }
}
function requestCalendarPhotoPassword(){revealCalendarPhoto()}
function renderRoutine(){
  const stage=stageAt(dayKey()),names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],order=[2,3,4,5,6,0,1];
  $('routineStage').textContent=STAGE_NAMES[stage]+' · 6 training days';
  $('routineList').innerHTML=order.map(d=>{
    const p=PROGRAMS[stage][d];
    const isToday=d===weekday();
    const list=p.ids.length?p.ids.map(id=>{const e=EX(id);return e?e.name+' ('+formatRx(e,rxFor(e,stage))+')':id}).join(' · '):'Rest or one make-up session from this week.';
    return '<div class="routineRow"><div><b>'+names[d]+' · '+p.title+(isToday?' · TODAY':'')+'</b><small>'+list+'</small></div><span class="durationTag">'+(p.mins?p.mins+' MIN':'REST')+'</span></div>';
  }).join('');
}
function renderSettings(){
  $('spotifyPlaylistInput').value=profile.spotifyPlaylist||'';
  $('spotifyPlaylistStatus').textContent=profile.spotifyPlaylist?'Saved. PLAY starts this playlist.':'No focus playlist saved. PLAY resumes the current Spotify track.';
  $('weightInput').value=profile.weightKg?String(profile.weightKg):'';
  if(profile.weightKg){
    const c=calories();
    $('weightStatus').textContent='Saved: '+profile.weightKg+' kg. Today: '+c.text+'. '+c.note;
  }else{
    $('weightStatus').textContent='No weight saved. The calorie estimate stays hidden until you add it.';
  }
}
function saveWeight(){
  const raw=$('weightInput').value.trim();
  if(!raw){
    profile.weightKg=null;saveProfile();renderSettings();renderHome();toast('Body weight cleared.');return;
  }
  const v=Number(raw);
  if(!isFinite(v)||v<25||v>300){toast('Enter a body weight between 25 and 300 kg.');return}
  profile.weightKg=Math.round(v*10)/10;
  profile.weightHistory=profile.weightHistory||{};
  profile.weightHistory[dayKey()]=profile.weightKg;
  saveProfile();renderSettings();renderHome();toast('Body weight saved for the estimate.');
}
function advanceStage(){
  const stage=stageAt(dayKey()),start=stageRoot(stage),cnt=completedSince(start),days=daysBetween(start,dayKey())+1,weeks=Math.floor((days-1)/7);
  const can=stage<3&&!pendingStage()&&((stage===1&&cnt>=6&&days>=7)||(stage===2&&cnt>=36&&weeks>=12));
  if(!can){toast('The current stage is not ready to advance yet.');return}
  if(!confirm('Move to '+STAGE_NAMES[stage+1]+'? It starts on the next day. Day 1 and all history stay unchanged.'))return;
  const next=stage+1,startDate=addDays(dayKey(),1);
  profile.stageHistory.push({stage:next,startedAt:startDate});
  profile.stage=next;
  profile.stageStartedAt=startDate;
  saveProfile();
  renderHome();
  toast(STAGE_NAMES[next]+' starts '+pretty(startDate,{day:'numeric',month:'short'})+'.');
}
function startMakeup(){
  const k=dayKey(),select=$('makeupSelect'),sel=select.value;
  if(weekday(k)!==1||!sel){toast('Choose a missed session first.');return}
  profile.makeup[mondayOf(k)]=sel;
  saveProfile();
  renderHome();
  startToday();
}
let spotifyBound=false,spotifyApi=null,spotifyState={},spotifyLastStatus='',spotifyConnectPending=false;
let localMusicUrl='';
let localMusicFiles=[],localMusicIndex=0;
function localMusicApi(){
  return window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalMusic?window.Capacitor.Plugins.LocalMusic:null;
}
async function selectLocalMusicFolder(){
  const api=localMusicApi();
  if(!api){$('localMusicStatus').textContent='Folder selection is available in the Android app.';return}
  try{
    const result=await api.pickFolder();
    localMusicFiles=result.files||[];
    localMusicIndex=0;
    if(!localMusicFiles.length){$('localMusicStatus').textContent='No audio files found in that folder.';return}
    playLocalMusicUri(localMusicFiles[0].uri,localMusicFiles[0].name);
    $('localMusicStatus').textContent=localMusicFiles.length+' local songs found.';
  }catch(e){$('localMusicStatus').textContent='Folder selection cancelled.'}
}
function playLocalMusicUri(uri,name){
  const audio=$('localMusicAudio');
  if(!audio||!uri)return;
  audio.src=uri;
  audio.load();
  audio.play().catch(()=>{});
  $('localMusicStatus').textContent='Playing locally: '+name+' ('+(localMusicIndex+1)+'/'+localMusicFiles.length+')';
}
function clearLocalMusic(){
  const audio=$('localMusicAudio');
  if(audio){
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }
  if(localMusicUrl){
    try{URL.revokeObjectURL(localMusicUrl)}catch(e){}
    localMusicUrl='';
  }
  $('localMusicFile').value='';
  $('localMusicStatus').textContent='Choose an audio file stored on this device. It is played locally and is not uploaded.';
}
function selectLocalMusic(){
  const input=$('localMusicFile'),file=input.files&&input.files[0];
  if(!file)return;
  if(!file.type||!file.type.startsWith('audio/')){
    input.value='';
    $('localMusicStatus').textContent='Choose a supported audio file.';
    return;
  }
  const audio=$('localMusicAudio');
  if(!audio||typeof URL==='undefined'||typeof URL.createObjectURL!=='function'){
    $('localMusicStatus').textContent='Local audio playback is unavailable in this app build.';
    return;
  }
  localMusicFiles=Array.from(input.files||[]);
  localMusicIndex=0;
  playLocalMusicFile(file);
}
function playLocalMusicFile(file){
  const audio=$('localMusicAudio');
  if(!audio||!file)return;
  if(localMusicUrl)try{URL.revokeObjectURL(localMusicUrl)}catch(e){}
  localMusicUrl=URL.createObjectURL(file);
  audio.src=localMusicUrl;
  audio.load();
  audio.play().catch(()=>{});
  $('localMusicStatus').textContent='Playing locally: '+file.name+' ('+(localMusicIndex+1)+'/'+localMusicFiles.length+')';
}
function playNextLocalMusic(){
  if(localMusicFiles.length<2)return;
  localMusicIndex=(localMusicIndex+1)%localMusicFiles.length;
  const entry=localMusicFiles[localMusicIndex];
  if(entry.uri)playLocalMusicUri(entry.uri,entry.name);
  else playLocalMusicFile(entry);
}
function spotifyApiGet(){
  return window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Spotify?window.Capacitor.Plugins.Spotify:null;
}
function renderSpotify(){
  spotifyApi=spotifyApiGet();
  if(!spotifyApi){
    console.warn('[FORM Spotify] Native bridge unavailable');
    applySpotify({available:false,configured:false,installed:false,connected:false});
    return;
  }
  if(!spotifyBound){
    spotifyBound=true;
    try{spotifyApi.addListener('stateChanged',s=>applySpotify(s||{}))}catch(e){}
    try{spotifyApi.addListener('authResult',()=>setTimeout(renderSpotify,250))}catch(e){}
  }
  Promise.resolve(spotifyApi.getState()).then(s=>applySpotify(s||{})).catch(()=>applySpotify({available:false,configured:false,installed:false,connected:false,error:true}));
}
const SPOTIFY_NOTES={
  unconfigured:'This build has no valid Spotify Client ID. Add the 32-character ID at build time, then rebuild.',
  not_installed:'Install the official Spotify app and sign in.',
  not_logged_in:'Open Spotify, sign in, then return to FORM and tap LINK.',
  auth_failed:'Spotify rejected authorisation. Check the dashboard redirect URI and package fingerprint, then try LINK again.',
  connected:'Spotify connected.',
  disconnected:'Spotify disconnected. Tap LINK to connect again.',
  connecting:'Spotify authorisation is open. Finish it in the browser, then return to FORM.',
  error:'Spotify could not complete that action. Try again.'
};
function applySpotify(s){
  spotifyState=s||{};
  const available=s.available!==false&&!!spotifyApi;
  const configured=!!s.configured;
  const installed=!!s.installed;
  const connected=!!s.connected;
  const playing=!!s.playing;
  if(s.status)spotifyLastStatus=String(s.status);
  if(connected)spotifyLastStatus='connected';
  const status=String(s.status||spotifyLastStatus||'');
  let label='UNAVAILABLE';
  if(available){
    if(!configured)label='SETUP NEEDED';
    else if(!installed)label='APP MISSING';
    else if(status==='connecting')label='LINKING';
    else if(connected)label='CONNECTED';
    else if(status==='auth_failed')label='AUTH FAILED';
    else if(status==='not_logged_in')label='LOG IN';
    else if(status==='error')label='TRY AGAIN';
    else label='READY';
  }
  const hasPlaylist=!!spotifyUri(profile.spotifyPlaylist);
  $('spotifyStatus').textContent=label;
  $('spotifyTrack').textContent=connected&&s.track?s.track:'Not connected';
  $('spotifyArtist').textContent=connected&&s.artist?s.artist:available&&installed?'Spotify is ready to link.':'Spotify controls are optional.';
  const canUse=available&&configured&&installed;
  $('spotifyPrev').disabled=!connected;
  $('spotifyNext').disabled=!connected;
  $('spotifyPlay').disabled=!connected||playing;
  $('spotifyPlay').textContent=hasPlaylist?'PLAY FOCUS':'PLAY';
  $('spotifyPause').disabled=!connected||!playing;
  $('spotifyConnect').disabled=connected||spotifyConnectPending;
  $('spotifyDisconnect').classList.toggle('hidden',!connected);
  let note='Spotify is optional. FORM works fully without it.';
  if(!available&&s.error)note='The native Spotify bridge is unavailable in this build. Rebuild after adding the plugin.';
  else if(!available)note='Open FORM as the Android app to use Spotify controls.';
  else if(!configured)note=SPOTIFY_NOTES.unconfigured;
  else if(!installed)note=SPOTIFY_NOTES.not_installed;
  else if(status&&status!=='connected'&&SPOTIFY_NOTES[status])note=SPOTIFY_NOTES[status];
  else if(!connected)note='Tap LINK. Finish the Spotify authorisation in the browser, then return to FORM.';
  else if(!hasPlaylist)note='Spotify connected. Add a focus playlist in Settings, or PLAY resumes the current track.';
  else note='PLAY starts your saved focus playlist. Audio streams from the official Spotify app.';
  $('spotifyNote').textContent=note;
}
function spotifyUri(value){
  const v=String(value||'').trim();
  if(!v)return '';
  let m=v.match(/spotify:playlist:([A-Za-z0-9]+)/);
  if(m)return 'spotify:playlist:'+m[1];
  m=v.match(/spotify:user:[^:]+:playlist:([A-Za-z0-9]+)/);
  if(m)return 'spotify:playlist:'+m[1];
  m=v.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
  if(m)return 'spotify:playlist:'+m[1];
  return '';
}
function saveSpotifyPlaylist(){
  const raw=$('spotifyPlaylistInput').value;
  const uri=spotifyUri(raw);
  if(raw.trim()&&!uri){toast('Paste a Spotify playlist link or URI.');return}
  profile.spotifyPlaylist=uri;
  saveProfile();
  renderSettings();
  renderSpotify();
  toast(uri?'Focus playlist saved.':'Focus playlist cleared.');
}
async function spotifyCall(method,data){
  console.info('[FORM Spotify] action requested:',method);
  if(!spotifyApi){
    console.warn('[FORM Spotify] Cannot launch action: native bridge unavailable');
    toast('Spotify is unavailable in this build. Reinstall the Android build with Spotify support.');
    return;
  }
  if(method==='connect'&&spotifyConnectPending){
    console.info('[FORM Spotify] Duplicate connect ignored');
    return;
  }
  if(method==='connect')spotifyConnectPending=true;
  if(method==='connect')applySpotify({...spotifyState,status:'connecting'});
  try{
    const result=await spotifyApi[method](data||{});
    const status=result&&result.status?String(result.status):'';
    if(status==='auth_failed')toast(SPOTIFY_NOTES.auth_failed);
    else if(status==='not_logged_in')toast(SPOTIFY_NOTES.not_logged_in);
    else if(status==='not_installed')toast(SPOTIFY_NOTES.not_installed);
    else if(status==='unconfigured')toast(SPOTIFY_NOTES.unconfigured);
    else if(status==='error')toast(SPOTIFY_NOTES.error);
    if(result)applySpotify(result);
    setTimeout(renderSpotify,300);
  }catch(e){
    console.warn('[FORM Spotify] action failed:',method);
    toast('Spotify is not available right now.');
  }finally{
    if(method==='connect'){
      spotifyConnectPending=false;
      setTimeout(renderSpotify,300);
    }
  }
}
function vaultApi(){return window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Vault?window.Capacitor.Plugins.Vault:null}
function backupApi(){return window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Backup?window.Capacitor.Plugins.Backup:null}
function registerNotificationTapHandler(){
  const api=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
  if(!api||typeof api.addListener!=='function')return;
  try{
    api.addListener('localNotificationActionPerformed',event=>{
      const actionId=event&&event.actionId?String(event.actionId):'tap';
      console.info('[FORM Notifications] Notification tapped:',actionId);
      if(actionId==='tap'){
        showHome();
      }else{
        console.info('[FORM Notifications] Notification action received:',actionId);
      }
    });
  }catch(e){
    console.warn('[FORM Notifications] Tap listener registration failed');
  }
}
async function refreshVaultDates(){
  const api=vaultApi();if(!api)return;
  try{
    const s=await api.list();
    vaultDates=new Set((s.files||[]).map(f=>f.date));
    if(currentView==='streak')renderStreak();
  }catch(e){}
}
function showVaultPanel(which){
  $('vaultCapturePanel').classList.toggle('hidden',which!=='take');
  $('vaultPhotosPanel').classList.toggle('hidden',which==='take');
  $('vaultTakeTab').classList.toggle('active',which==='take');
  $('vaultSeeTab').classList.toggle('active',which!=='take');
}
function previewVaultPhoto(){
  const files=selectedVaultFiles;
  const file=files[0];
  vaultPreviewData='';
  $('vaultPreview').classList.add('hidden');
  $('vaultPreview').src='';
  if(!file)return;
  const invalid=files.find(item=>item.size>12*1024*1024||!/^image\//.test(item.type));
  if(invalid){toast('Each photo must be an image under 12 MB.');$('vaultPhoto').value='';$('vaultCamera').value='';selectedVaultFiles=[];return}
  const reader=new FileReader();
  reader.onload=()=>{
    const value=String(reader.result||'');
    vaultPreviewData=value.split(',')[1]||'';
    $('vaultPreview').src=value;
    $('vaultPreview').classList.remove('hidden');
  };
  reader.onerror=()=>toast('Could not read that photo.');
  reader.readAsDataURL(file);
}
async function renderVault(){
  const api=vaultApi();
  if(!api){
    vaultMeta={configured:false,unlocked:false};
    $('vaultStatus').textContent='UNAVAILABLE';
    $('vaultNote').textContent='Open FORM as the Android app to use the private vault.';
    $('vaultAuth').classList.add('hidden');
    $('vaultContent').classList.add('hidden');
    $('vaultLock').classList.add('hidden');
    return;
  }
  try{
    vaultMeta=await api.status();
  }catch(e){
    vaultMeta={configured:false,unlocked:false};
  }
  const configured=!!vaultMeta.configured,unlocked=!!vaultMeta.unlocked;
  $('vaultStatus').textContent=unlocked?'UNLOCKED':configured?'LOCKED':'NEW VAULT';
  $('vaultNote').textContent=unlocked?'Encrypted photos stay private until you leave this screen or FORM goes to the background.':'One password protects this vault. It cannot be shown or reset. If it is lost, the photos cannot be recovered.';
  $('vaultAuth').classList.toggle('hidden',unlocked);
  $('vaultContent').classList.toggle('hidden',!unlocked);
  $('vaultLock').classList.toggle('hidden',!unlocked);
  $('vaultAuthBtn').textContent=configured?'UNLOCK':'CREATE VAULT';
  $('vaultPasswordConfirm').classList.toggle('hidden',configured);
  $('vaultPassword').placeholder=configured?'Vault password':'New vault password';
  if(unlocked){
    if(!$('vaultDate').value)$('vaultDate').value=dayKey();
    $('vaultDate').max=dayKey();
    showVaultPanel('photos');
    await loadVaultList();
  }
}
async function vaultAuth(){
  const api=vaultApi();if(!api)return;
  const password=$('vaultPassword').value;
  const confirm=$('vaultPasswordConfirm').value;
  if(password.length<8){toast('Use at least 8 characters.');return}
  if(!vaultMeta.configured&&password!==confirm){toast('Passwords do not match.');return}
  try{
    const s=vaultMeta.configured?await api.unlock({password}):await api.setup({password});
    vaultMeta=s||{configured:true,unlocked:true};
    $('vaultPassword').value='';$('vaultPasswordConfirm').value='';
    toast(vaultMeta.configured?'Vault unlocked.':'Vault created.');
    await renderVault();
    await refreshVaultDates();
  }catch(e){
    toast(vaultMeta.configured?'Wrong password.':'Could not create the vault.');
  }
}
async function lockVault(silent){
  const api=vaultApi();
  if(api){try{await api.lock()}catch(e){}}
  vaultMeta={configured:!!vaultMeta.configured,unlocked:false};
  $('vaultPassword').value='';$('vaultPasswordConfirm').value='';
  $('vaultViewer').src='';$('vaultViewerWrap').classList.add('hidden');
  $('vaultPreview').src='';$('vaultPreview').classList.add('hidden');
  $('vaultPhoto').value='';$('vaultCamera').value='';selectedVaultFiles=[];vaultPreviewData='';
  $('vaultContent').classList.add('hidden');
  $('vaultAuth').classList.remove('hidden');
  $('vaultLock').classList.add('hidden');
  $('vaultStatus').textContent=vaultMeta.configured?'LOCKED':'NEW VAULT';
  $('vaultAuthBtn').textContent=vaultMeta.configured?'UNLOCK':'CREATE VAULT';
  $('vaultPasswordConfirm').classList.toggle('hidden',vaultMeta.configured);
  $('vaultNote').textContent='One password protects this vault. It cannot be shown or reset. If it is lost, the photos cannot be recovered.';
  if(!silent&&currentView==='vault')toast('Vault locked.');
}
async function loadVaultList(){
  const api=vaultApi();if(!api)return;
  try{
    const s=await api.list();
    vaultDates=new Set((s.files||[]).map(f=>f.date));
    $('vaultList').innerHTML=(s.files||[]).length?s.files.map(f=>'<div class="vaultItem"><div><b>'+pretty(f.date,{weekday:'short',day:'numeric',month:'short',year:'numeric'})+'</b><small>'+(Math.round(f.size/1024*10)/10)+' KB encrypted</small></div><div class="stepper"><button type="button" data-view="'+f.name+'" aria-label="View photo">VIEW</button><button type="button" data-delete="'+f.name+'" aria-label="Delete photo">DEL</button></div></div>').join(''):'<p class="smallNote">No private photos saved yet.</p>';
    $('vaultList').querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>openVaultPhoto(b.dataset.view));
    $('vaultList').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteVaultPhoto(b.dataset.delete));
  }catch(e){}
}
async function saveVaultPhoto(){
  const api=vaultApi();if(!api)return;
  const files=selectedVaultFiles;
  const date=$('vaultDate').value||dayKey();
  if(!files.length){toast('Take or choose at least one image.');return}
  if(files.some(file=>file.size>12*1024*1024||!/^image\//.test(file.type))){toast('Each photo must be an image under 12 MB.');return}
  if(date>dayKey()){toast('Choose today or an earlier date.');return}
  try{
    for(let i=0;i<files.length;i++){
      const file=files[i];
      const data=i===0&&vaultPreviewData?vaultPreviewData:await new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=()=>resolve(String(reader.result||'').split(',')[1]||'');
        reader.onerror=()=>reject(new Error('read'));
        reader.readAsDataURL(file);
      });
      if(!data)throw new Error('empty');
      $('vaultSave').textContent='ENCRYPTING '+(i+1)+'/'+files.length;
      await api.save({date,mime:file.type,data});
    }
    $('vaultPhoto').value='';$('vaultCamera').value='';selectedVaultFiles=[];vaultPreviewData='';
    $('vaultPreview').src='';$('vaultPreview').classList.add('hidden');
    toast(files.length===1?'Photo encrypted and saved.':files.length+' photos encrypted and saved.');
    await loadVaultList();
    await refreshVaultDates();
    showVaultPanel('photos');
    if(date===dayKey())renderHome();
  }catch(e){
    const message=String(e&&e.message||e||'');
    if(/locked/i.test(message)){toast('Vault locked. Unlock again, then save.');await lockVault(true);}
    else toast('Could not save the photo.');
  }
  $('vaultSave').textContent='ENCRYPT AND SAVE PHOTOS';
  vaultFilePicker=false;
}
async function openVaultPhoto(name){
  const api=vaultApi();if(!api)return;
  try{
    const s=await api.read({name});
    $('vaultViewer').src='data:'+s.mime+';base64,'+s.data;
    $('vaultViewerWrap').classList.remove('hidden');
    $('vaultViewerWrap').scrollIntoView({block:'center'});
  }catch(e){toast('Could not open the photo.');}
}
async function deleteVaultPhoto(name){
  const api=vaultApi();if(!api)return;
  if(!confirm('Delete this encrypted photo? This cannot be undone.'))return;
  try{
    await api.delete({name});
    $('vaultViewer').src='';$('vaultViewerWrap').classList.add('hidden');
    await loadVaultList();await refreshVaultDates();
    toast('Photo deleted.');
  }catch(e){toast('Could not delete the photo.');}
}
function renderBackup(){
  if(!backupApi()||!vaultApi())$('backupExport').disabled=true;
}
async function exportBackup(){
  const api=backupApi();if(!api)return;
  const password=$('backupExportPassword').value;
  if(password.length<8){toast('Use a backup password of at least 8 characters.');return}
  try{
    const vault=vaultApi();
    let vaultConfig=null,vaultFiles=[];
    if(vault){
      vaultConfig=await vault.exportConfig();
      const files=await vault.exportFiles();
      vaultFiles=files.files||[];
    }
    const payload={schema:1,exportedAt:new Date().toISOString(),data:db,profile,vault:{config:vaultConfig,files:vaultFiles}};
    const result=await api.exportBackup({data:JSON.stringify(payload),password,fileName:'FORM-backup-'+dayKey()+'.formbak'});
    $('backupExportPassword').value='';
    toast('Encrypted backup created.');
  }catch(e){toast('Backup was not created.');}
}
function sessionActivity(data){
  return Object.values(data||{}).filter(r=>r&&(r.sessionEnd||r.status==='completed'||r.status==='in-progress')).length;
}
function validateBackupPayload(payload){
  if(!payload||payload.schema!==1||!payload.data||typeof payload.data!=='object'||Array.isArray(payload.data)||!payload.profile||typeof payload.profile!=='object'||Array.isArray(payload.profile))return 'The backup structure is invalid.';
  const dates=Object.keys(payload.data);
  if(dates.length>20000)return 'The backup contains too many records.';
  for(const k of dates){
    if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(k)||!isFinite(parseDay(k).getTime()))return 'The backup contains an invalid date.';
    const r=payload.data[k];
    if(!r||typeof r!=='object'||Array.isArray(r))return 'The backup contains an invalid workout record.';
    if(r.done&&(!Array.isArray(r.done)||r.done.some(id=>typeof id!=='string')))return 'The backup contains invalid completed exercises.';
    if(r.events&&(typeof r.events!=='object'||Array.isArray(r.events)))return 'The backup contains invalid exercise events.';
  }
  if(payload.profile.dayOne&&(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(payload.profile.dayOne)||!isFinite(parseDay(payload.profile.dayOne).getTime())))return 'The backup contains an invalid Day 1.';
  const v=payload.vault;
  if(v&&(typeof v!=='object'||Array.isArray(v)))return 'The backup vault metadata is invalid.';
  if(v&&v.files&&!Array.isArray(v.files))return 'The backup vault files are invalid.';
  if(v&&v.files&&v.files.length&&(!v.config||typeof v.config.salt!=='string'||typeof v.config.check!=='string'))return 'The backup vault configuration is missing.';
  if(v&&v.files&&v.files.some(f=>!f||typeof f.name!=='string'||typeof f.data!=='string'))return 'The backup vault files are invalid.';
  return '';
}
async function importBackup(){
  const api=backupApi(),vault=vaultApi();if(!api)return;
  const password=$('backupImportPassword').value;
  if(password.length<8){toast('Enter the backup password.');return}
  if(!confirm('Restore this backup? Current FORM data will be replaced after the file is validated.'))return;
  let previousStore=null,previousProfile=null,storeReplaced=false,vaultRestored=false;
  try{
    const result=await api.importBackup({password});
    const payload=JSON.parse(result.data||'{}');
    const invalid=validateBackupPayload(payload);
    if(invalid)throw new Error(invalid);
    const current=sessionActivity(db),incoming=sessionActivity(payload.data);
    if(incoming<current&&!confirm('This backup has '+incoming+' recorded sessions. FORM currently has '+current+'. Restoring will replace newer records. Continue?'))return;
    previousStore=localStorage.getItem(STORE);
    previousProfile=localStorage.getItem(PROFILE_KEY);
    localStorage.setItem('FORM_PRE_RESTORE_BACKUP',JSON.stringify({db,profile,at:new Date().toISOString()}));
    localStorage.setItem(STORE,JSON.stringify(payload.data));
    localStorage.setItem(PROFILE_KEY,JSON.stringify(payload.profile));
    storeReplaced=true;
    if(vault&&payload.vault&&payload.vault.config){
      try{
        await vault.restoreBundle({salt:payload.vault.config.salt,check:payload.vault.config.check,files:payload.vault.files||[]});
        vaultRestored=true;
      }catch(e){
        if(previousStore===null)localStorage.removeItem(STORE);else localStorage.setItem(STORE,previousStore);
        if(previousProfile===null)localStorage.removeItem(PROFILE_KEY);else localStorage.setItem(PROFILE_KEY,previousProfile);
        throw new Error('vault');
      }
    }
    $('backupImportPassword').value='';
    toast('Backup restored. Reloading FORM.');
    setTimeout(()=>location.reload(),800);
  }catch(e){
    if(!vaultRestored&&storeReplaced){
      if(previousStore===null)localStorage.removeItem(STORE);else localStorage.setItem(STORE,previousStore);
      if(previousProfile===null)localStorage.removeItem(PROFILE_KEY);else localStorage.setItem(PROFILE_KEY,previousProfile);
    }
    toast(e&&/vault/.test(e.message)?'The encrypted photos could not be restored. Current data was kept.':'Could not restore this backup.');
  }
}
function beep(){
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A)return;
    const ctx=new A(),osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.frequency.value=880;gain.gain.value=.15;osc.start();osc.stop(ctx.currentTime+.45);
  }catch(e){}
  if(navigator.vibrate)navigator.vibrate([250,100,250]);
}
async function cancelLegacyAlarms(){
  const api=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
  if(!api)return;
  try{
    await api.cancel({notifications:[{id:4001},{id:5001},{id:9001}]});
    const pending=await api.getPending();
    const legacy=(pending&&pending.notifications||[]).filter(n=>n&&(n.id===4001||n.id===5001||n.id===9001));
    if(legacy.length)await api.cancel({notifications:legacy.map(n=>({id:n.id}))});
  }catch(e){}
  try{
    localStorage.removeItem('FORM_MONOCHROME_ALARM_V1');
    localStorage.removeItem('FORM_WAKE_ALARM_DONE');
    localStorage.removeItem('FORM_WORKOUT_ALARM_DONE');
    Object.keys(localStorage).filter(k=>k.indexOf('FORM_5AM_ALARM_')===0).forEach(k=>localStorage.removeItem(k));
  }catch(e){}
}

$('startToday').onclick=startToday;
$('openCalories').onclick=openCalories;
$('caloriesBack').onclick=showHome;
$('openVault').onclick=openVault;
$('vaultBack').onclick=showHome;
$('vaultLock').onclick=()=>lockVault();
$('vaultAuthBtn').onclick=vaultAuth;
$('vaultTakeTab').onclick=()=>showVaultPanel('take');
$('vaultSeeTab').onclick=()=>showVaultPanel('photos');
$('vaultSave').onclick=saveVaultPhoto;
$('vaultPhoto').onclick=()=>{vaultFilePicker=true};
$('vaultPhoto').onchange=()=>{
  selectedVaultFiles=Array.from($('vaultPhoto').files||[]);
  previewVaultPhoto();
  setTimeout(()=>{vaultFilePicker=false},1500);
};
$('vaultCamera').onclick=()=>{vaultFilePicker=true};
$('vaultCamera').onchange=()=>{
  selectedVaultFiles=Array.from($('vaultCamera').files||[]);
  previewVaultPhoto();
  setTimeout(()=>{vaultFilePicker=false},1500);
};
$('vaultCloseViewer').onclick=()=>{$('vaultViewer').src='';$('vaultViewerWrap').classList.add('hidden')};
$('openBackup').onclick=openBackup;
$('backupBack').onclick=showHome;
$('backupExport').onclick=exportBackup;
$('backupImport').onclick=importBackup;
$('waterMinus').onclick=()=>adjustWater(-250);
$('waterPlus').onclick=()=>adjustWater(250);
$('proteinMinus').onclick=()=>adjustProtein(-10);
$('proteinPlus').onclick=()=>adjustProtein(10);
$('saveNutritionTargets').onclick=saveNutritionTargets;
$('openStreak').onclick=openStreak;
$('menuToggle').onclick=toggleNavigationMenu;
$('menuHome').onclick=showHome;
$('menuSettings').onclick=openSettings;
$('openRoutine').onclick=openRoutine;
$('openSettings').onclick=openSettings;
$('streakBack').onclick=showHome;
$('calendarPrevious').onclick=()=>shiftCalendarMonth(-1);
$('calendarNext').onclick=()=>shiftCalendarMonth(1);
$('calendarToday').onclick=showCurrentCalendarMonth;
$('calendarPhotoUnlock').onclick=revealCalendarPhoto;
$('calendarPhotoBlurred').onclick=requestCalendarPhotoPassword;
$('routineBack').onclick=showHome;
$('settingsBack').onclick=showHome;
$('backHome').onclick=showHome;
$('finishHome').onclick=showHome;
$('routineFromWorkout').onclick=openRoutine;
$('showHistoryFromWorkout').onclick=openStreak;
$('backToWorkout').onclick=()=>{clearExerciseTimer();clearRest();renderWorkout();show('workout')};
$('exerciseSkip').onclick=()=>{clearExerciseTimer();clearRest();renderWorkout();show('workout')};
$('exerciseAction').onclick=actionSet;
$('repPlus').onclick=()=>adjustRep(1);
$('repMinus').onclick=()=>adjustRep(-1);
$('continueAfterRest').onclick=continueRest;
$('advanceStage').onclick=advanceStage;
$('startMakeup').onclick=startMakeup;
$('saveWeight').onclick=saveWeight;
$('spotifyConnect').onclick=()=>spotifyCall('connect');
$('spotifyDisconnect').onclick=()=>spotifyCall('disconnect');
$('spotifyPlay').onclick=()=>spotifyCall('play',profile.spotifyPlaylist?{uri:profile.spotifyPlaylist}:{});
$('spotifyPause').onclick=()=>spotifyCall('pause');
$('spotifyNext').onclick=()=>spotifyCall('next');
$('spotifyPrev').onclick=()=>spotifyCall('previous');
$('localMusicFile').onchange=selectLocalMusic;
$('localMusicFolder').onclick=selectLocalMusicFolder;
$('localMusicClear').onclick=clearLocalMusic;
$('localMusicAudio').onended=playNextLocalMusic;
let homePlanTouchStart=0;
const homePlanCard=$('homePlanCard');
if(homePlanCard&&typeof homePlanCard.addEventListener==='function'){
  homePlanCard.addEventListener('touchstart',event=>{
    homePlanTouchStart=event.touches[0]?.clientX||0;
  },{passive:true});
  homePlanCard.addEventListener('touchend',event=>{
    const end=event.changedTouches[0]?.clientX||homePlanTouchStart;
    swipeHomePlan(end-homePlanTouchStart);
  },{passive:true});
}
$('saveSpotifyPlaylist').onclick=saveSpotifyPlaylist;
$('exportHistory').onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='FORM-workout-history.json';a.click();
  URL.revokeObjectURL(a.href);
};
relocateRedesignPanels();
document.querySelectorAll('[data-nav-view]').forEach(button=>button.onclick=()=>show(button.dataset.navView));
$('menuMore').onclick=()=>show('more');
$('progressHistory').onclick=openStreak;
$('moreRecovery').onclick=()=>show('recovery');
$('moreNutrition').onclick=()=>show('nutrition');
$('moreMusic').onclick=()=>show('music');
$('moreVault').onclick=openVault;
$('moreSettings').onclick=openSettings;
$('moreAbout').onclick=()=>{
  const panel=$('aboutForm');
  panel.classList.toggle('hidden');
  if(!panel.classList.contains('hidden'))panel.scrollIntoView({behavior:'smooth',block:'nearest'});
};
window.activeDay=dayKey();
cancelLegacyAlarms();
registerNotificationTapHandler();
renderRoutine();
renderHome();
renderSpotify();
restoreActiveSession();
setInterval(()=>{
  live();
  if(dayKey()!==window.activeDay){window.activeDay=dayKey();renderHome();show('home')}
},1000);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&!vaultFilePicker){
    lockVault(true);
    clearCalendarPhoto();
    const api=vaultApi();
    if(api&&vaultMeta.unlocked)api.lock().catch(()=>{});
    vaultMeta={configured:!!vaultMeta.configured,unlocked:false};
  }
});
window.addEventListener('focus',()=>{
  closeNavigationMenu();
  setTimeout(()=>{vaultFilePicker=false},1500);
  if($('home').classList.contains('active'))renderHome();
  renderSpotify();
  if(currentView==='vault'&&$('vaultContent').classList.contains('hidden'))renderVault();
});
refreshVaultDates();