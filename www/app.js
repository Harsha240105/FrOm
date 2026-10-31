const $=id=>document.getElementById(id);
const STORE='FORM_MONOCHROME_LOG_V1';
const ALARMS='FORM_MONOCHROME_ALARM_V1';
const PROFILE_KEY='FORM_PROFILE_V1';
const BACKUP_KEY='FORM_MONOCHROME_LOG_V1_BACKUP_V02';
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
  if(typeof p.spotifyPlaylist!=='string')p.spotifyPlaylist='';
  p.scheduleVersion=2;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p))}catch(e){}
  try{if(Object.keys(db).length&&!localStorage.getItem(BACKUP_KEY))localStorage.setItem(BACKUP_KEY,JSON.stringify(db))}catch(e){}
  return p;
}

function record(k=dayKey()){return db[k]||(db[k]={sessionStart:null,sessionEnd:null,done:[],events:{},status:'not-started'})}
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
function plan(){return dayPlan(dayKey())}
function planStage(){const p=plan();return p.stage||stageAt(dayKey())}
function isDayComplete(k){
  const p=dayPlan(k),r=db[k];
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
function timeString(x){return x?new Date(x).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'—'}
function durationString(a,b){if(!a||!b)return '—';let s=Math.max(0,Math.floor((new Date(b)-new Date(a))/1000));return Math.floor(s/60)+'m '+String(s%60).padStart(2,'0')+'s'}
function fmt(sec){return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3200)}
function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const el=$(id);if(!el)return;
  el.classList.add('active');
  if(id==='home')renderHome();
  if(id==='workout')renderWorkout();
  if(id==='streak')renderStreak();
  if(id==='routine')renderRoutine();
  if(id==='settings')renderSettings();
  window.scrollTo(0,0);
}
function showHome(){show('home')}
function openSettings(){show('settings')}
function openStreak(){show('streak')}
function openReminder(){show('reminder')}
function openRoutine(){show('routine')}

function calories(){
  const k=dayKey(),p=dayPlan(k),r=db[k],stage=p.stage||stageAt(k),kg=Number(profile.weightKg);
  if(!kg)return {text:'SET WEIGHT',note:'Add optional body weight in Settings for an estimate.'};
  if(!p.ids.length)return {text:'0 kcal',note:'Rest day. No workout estimate.'};
  let mins=p.mins||0;
  if(r&&r.sessionStart&&r.sessionEnd)mins=Math.max(1,Math.round((new Date(r.sessionEnd)-new Date(r.sessionStart))/60000));
  const met=stage===1?3:stage===2?3.5:4;
  return {text:'~'+Math.round(met*3.5*kg/200*mins)+' kcal',note:'Estimate only · '+mins+' min · stage '+stage};
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
  const preview=p.ids.length?p.ids.map(id=>EX(id)?.name||id).join(' · '):'No workout scheduled. Recovery is part of the plan.';
  $('todayStatus').textContent=complete?'TODAY COMPLETED':r.sessionStart?'SESSION IN PROGRESS':p.ids.length?'NOT STARTED':cands.length?'MAKE-UP AVAILABLE':'REST DAY';
  $('planName').textContent=p.ids.length?p.title:weekday(k)===1?'Rest and make-up':'Rest and reset';
  $('planTime').textContent=p.ids.length?'04:00–05:30 AM':'RECOVERY';
  $('durationTag').textContent=p.mins?p.mins+' MIN':'REST';
  $('exercisePreview').textContent=preview;
  $('startToday').textContent=complete?'VIEW COMPLETED SESSION':r.sessionStart?'CONTINUE WORKOUT':p.ids.length?'START TODAY':cands.length?'CHOOSE MAKE-UP':'VIEW REST DAY';
  $('streakCount').textContent=streak();
  $('completedCount').textContent=completedCount();
  const m=monthCount();$('monthProgress').textContent=m.done+'/'+m.scheduled;
  const cal=calories();$('calorieEstimate').textContent=cal.text;$('calorieNote').textContent=cal.note;
  renderStage();
  renderMakeup(cands);
  renderDailyGuide(complete,p);
  renderSpotify();
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
  activeId=id;repValue=ev.currentReps||0;timerDone=false;
  clearExerciseTimer();clearRest();
  saveDB();
  renderExercise();
  show('exercise');
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
  let sec=rx.seconds;
  timerDone=false;
  $('exerciseTimer').textContent=fmt(sec);
  $('exerciseAction').disabled=true;$('exerciseAction').textContent='TIMER RUNNING';
  $('timerHint').textContent='Keep the position and breathe.';
  exTimer=setInterval(()=>{
    sec--;
    $('exerciseTimer').textContent=fmt(Math.max(0,sec));
    if(sec<=0){
      clearExerciseTimer();beep();timerDone=true;
      $('exerciseAction').disabled=false;$('exerciseAction').textContent='COMPLETE SET';
      $('timerHint').textContent='Time complete. Tap Complete set.';
    }
  },1000);
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
    sec--;
    $('restTimer').textContent=fmt(Math.max(0,sec));
    if(sec<=0){
      clearRest();beep();
      const rr=record(),ee=rr.events[restFromId];
      if(ee)ee.restEnd=new Date().toISOString();
      saveDB();
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
  $('sumStart').textContent=timeString(r.sessionStart);
  $('sumEnd').textContent=timeString(r.sessionEnd);
  $('sumDuration').textContent=durationString(r.sessionStart,r.sessionEnd);
  $('sumCount').textContent=r.done.length+' / '+p.ids.length;
  $('sumDate').textContent='Saved for '+pretty(dayKey(),{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  renderHome();
  show('finished');
}
function renderStreak(){
  const d=trainingDate(),y=d.getFullYear(),m=d.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0).getDate(),today=dayKey();
  const total=streak();
  $('streakTotal').textContent=total+(total===1?' day':' days');
  $('monthTitle').textContent=d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  let html=['M','T','W','T','F','S','S'].map(x=>'<div class="calendarCell dow">'+x+'</div>').join('');
  const lead=(first.getDay()+6)%7;
  for(let i=0;i<lead;i++)html+='<div class="calendarCell pre"></div>';
  for(let n=1;n<=last;n++){
    const k=dayISO(new Date(y,m,n)),p=dayPlan(k),done=isDayComplete(k),r=db[k];
    let state='';
    if(k<profile.dayOne)state='pre';
    else if(done)state='done';
    else if(k>today)state=p.ids.length?'future':'rest';
    else if(!p.ids.length)state='rest';
    else if(k===today)state='';
    else state='missedrest';
    html+='<div class="calendarCell '+state+(k===today?' today':'')+'">'+n+'</div>';
  }
  $('calendar').innerHTML=html;
  const keys=Object.keys(db).sort().reverse().slice(0,20);
  $('historyList').innerHTML=keys.map(k=>{
    const r=db[k],p=dayPlan(k),done=isDayComplete(k);
    const detail=Object.entries(r.events||{}).map(([id,e])=>'<div class="tinyNote">'+(EX(id)?.name||id)+': '+timeString(e.startedAt)+' to '+timeString(e.endedAt)+'</div>').join('');
    let status='REST DAY';
    if(done)status='COMPLETED';
    else if(p.ids.length&&k<today)status='REST · MISSED WORKOUT';
    else if(p.ids.length&&k===today)status=r.sessionStart?'IN PROGRESS':'NOT STARTED';
    return '<div class="historyItem"><div><b>'+pretty(k,{weekday:'short',day:'numeric',month:'short',year:'numeric'})+'</b><div class="smallNote">'+p.title+'</div>'+detail+'<div class="tinyNote">Session: '+timeString(r.sessionStart)+' to '+timeString(r.sessionEnd)+'</div></div><b>'+status+'</b></div>';
  }).join('')||'<p class="smallNote">Your history will appear here after you start a session.</p>';
}
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
let spotifyBound=false,spotifyApi=null,spotifyState={};
function spotifyApiGet(){
  return window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Spotify?window.Capacitor.Plugins.Spotify:null;
}
function renderSpotify(){
  spotifyApi=spotifyApiGet();
  if(!spotifyApi){
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
function applySpotify(s){
  spotifyState=s||{};
  const available=s.available!==false&&!!spotifyApi;
  const configured=!!s.configured;
  const installed=!!s.installed;
  const connected=!!s.connected;
  const playing=!!s.playing;
  let label='UNAVAILABLE';
  if(available){if(!configured)label='SETUP NEEDED';else if(!installed)label='APP MISSING';else if(connected)label='CONNECTED';else label='READY'}
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
  $('spotifyConnect').disabled=!canUse||connected;
  $('spotifyDisconnect').classList.toggle('hidden',!connected);
  let note='Spotify is optional. FORM works fully without it.';
  if(!available&&s.error)note='The native Spotify bridge is unavailable in this build. Rebuild after adding the plugin.';
  else if(!available)note='Open FORM as the Android app to use Spotify controls.';
  else if(!configured)note='This build has no Spotify Client ID. Add it at build time, then rebuild.';
  else if(!installed)note='Install the official Spotify app and sign in.';
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
  if(!spotifyApi)return;
  try{
    const result=await spotifyApi[method](data||{});
    if(result&&result.status==='auth')toast('Finish Spotify authorisation in the browser.');
    if(result&&result.status==='error')toast('Spotify could not complete that action.');
    setTimeout(renderSpotify,300);
  }catch(e){
    toast('Spotify is not available right now.');
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
function setAndroidAlarm(h,m,label){
  const u='intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE='+encodeURIComponent(label)+';i.android.intent.extra.alarm.HOUR='+h+';i.android.intent.extra.alarm.MINUTES='+m+';B.android.intent.extra.alarm.SKIP_UI=false;end';
  location.href=u;
}
const alarmIds={wake:'FORM_WAKE_ALARM_DONE',workout:'FORM_WORKOUT_ALARM_DONE'};
function wakeAlarm(title='04:00 AM · Wake up',message='Your morning starts now. Your workout is planned for 5:00 AM.'){
  beep();
  $('wakeTitle').textContent=title;
  $('wakeMessage').textContent=message;
  $('wakeModal').classList.add('show');
  if('Notification'in window&&Notification.permission==='granted'){
    try{new Notification('FORM · '+title,{body:message})}catch(e){}
  }
}
function checkWake(){
  const n=new Date(),k=dayKey();
  if(n.getHours()===4&&n.getMinutes()<30&&localStorage.getItem(alarmIds.wake)!==k){
    localStorage.setItem(alarmIds.wake,k);
    wakeAlarm('04:00 AM · Wake up','Your morning starts now. Your workout is planned for 5:00 AM.');
  }
}
function checkWorkoutAlarm(){
  const n=new Date(),k=dayKey(),r=record();
  if(!plan().ids.length)return;
  if(n.getHours()===5&&n.getMinutes()<30&&!r.sessionStart&&localStorage.getItem('FORM_5AM_ALARM_'+k)!==k){
    localStorage.setItem('FORM_5AM_ALARM_'+k,k);
    wakeAlarm('05:00 AM · Workout time','Your planned workout is ready. Tap Start Today when you are ready.');
  }
}

$('startToday').onclick=startToday;
$('phoneAlarm').onclick=()=>setAndroidAlarm(4,0,'FORM wake-up');
$('openStreak').onclick=openStreak;
$('openReminder').onclick=openReminder;
$('openRoutine').onclick=openRoutine;
$('openSettings').onclick=openSettings;
$('streakBack').onclick=showHome;
$('reminderBack').onclick=showHome;
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
$('saveSpotifyPlaylist').onclick=saveSpotifyPlaylist;
$('setWakeAlarm').onclick=()=>setAndroidAlarm(4,0,'FORM wake-up');
$('setWorkoutAlarm').onclick=()=>setAndroidAlarm(5,0,'FORM workout starts');
$('testAlarm').onclick=beep;
$('allowNotifications').onclick=async()=>{
  if(!('Notification'in window)){alert('Notifications are not supported in this browser.');return}
  const p=await Notification.requestPermission();
  alert('Notification permission: '+p);
};
$('dismissWake').onclick=()=>$('wakeModal').classList.remove('show');
$('snoozeWake').onclick=()=>{$('wakeModal').classList.remove('show');setTimeout(wakeAlarm,10*60*1000)};
$('exportHistory').onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='FORM-workout-history.json';a.click();
  URL.revokeObjectURL(a.href);
};
window.activeDay=dayKey();
renderRoutine();
renderHome();
renderSpotify();
setInterval(()=>{
  live();checkWake();checkWorkoutAlarm();
  if(dayKey()!==window.activeDay){window.activeDay=dayKey();renderHome();show('home')}
},1000);
window.addEventListener('focus',()=>{if($('home').classList.contains('active'))renderHome();renderSpotify()});