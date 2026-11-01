'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('www/app.js', 'utf8');
const store = new Map();
const elements = new Map();
function makeElement(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    innerText: '',
    value: '',
    src: '',
    disabled: false,
    checked: false,
    files: [],
    style: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }
  };
}
function element(id) {
  if (!elements.has(id)) elements.set(id, makeElement(id));
  return elements.get(id);
}
const document = {
  getElementById: id => element(id),
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  hidden: false,
  activeElement: element('root')
};
const window = { addEventListener() {}, removeEventListener() {}, scrollTo() {}, location: { reload() {} }, activeDay: '' };
const localStorage = {
  getItem: key => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: key => store.delete(key),
  clear: () => store.clear()
};
const sandbox = {
  document,
  window,
  localStorage,
  navigator: { userAgent: 'node-test' },
  Capacitor: undefined,
  setInterval: () => 0,
  clearInterval: () => {},
  clearTimeout: () => {},
  setTimeout: () => 0,
  console,
  assert,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  Math,
  Date,
  Object,
  Array,
  JSON,
  String,
  Number,
  Boolean,
  Promise,
  Reflect,
  Proxy,
  Map,
  Set
};
sandbox.globalThis = sandbox;
const testCode = `
const k='2026-11-03';
const p=dayPlan(k);
assert(p && Array.isArray(p.ids) && p.ids.length > 0, 'The test date must be a training day.');
const id=p.ids.find(c=>EX(c)?.kind==='time')||p.ids[0];
const exercise=EX(id);
const now=new Date().toISOString();
db[k]={sessionStart:now,sessionEnd:now,done:[id],events:{[id]:{startedAt:now,endedAt:now,setsCompleted:2,setLogs:[{set:0,startedAt:now,endedAt:now,reps:exercise.reps||0,seconds:exercise.seconds||0},{set:1,startedAt:now,endedAt:now,reps:exercise.reps||0,seconds:exercise.seconds||0}]}},status:'completed'};
profile.weightKg=80;
profile.weightHistory={};
const d=caloriesForDay(k);
assert.strictEqual(d.kg,80,'The weight snapshot should use the saved body weight.');
assert(d.minutes>0,'Completed timed work should produce an active calorie estimate.');
const expected=Math.round((((3.5-1)*3.5*80*2)/200)*10)/10;
assert(Math.abs(d.kcal-expected)<1,'Calorie estimate should use MET and completed work only; got '+d.kcal+', expected '+expected+'.');
profile.weightHistory={[k]:90};
assert.strictEqual(weightForDay(k),90,'Weight history should override the current weight for a date.');
db[k]={sessionStart:now,sessionEnd:now,done:[id],events:{},status:'completed'};
const unlogged=caloriesForDay(k);
assert.strictEqual(unlogged.minutes,0,'A completed day without logged exercise work must not be turned into an estimate.');
const total=totalCalories();
assert(Number.isFinite(total.kcal)&&Number.isFinite(total.minutes),'The calorie total should be numeric.');
__FORM_TEST__={caloriesForDay,weightForDay,dayPlan,EX,rxFor,stageAt,totalCalories};
`;
vm.createContext(sandbox);
vm.runInContext(source + testCode, sandbox, { filename: 'www/app.js' });
const api = sandbox.__FORM_TEST__;
console.log('FORM calorie check passed: MET calculation, completed work, and weight snapshot.');
