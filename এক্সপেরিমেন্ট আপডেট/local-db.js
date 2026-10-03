// Simple persistent local JSON database (no MongoDB/server required).
// Data is stored in ./data/employee_monitoring.json on this computer.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'employee_monitoring.json');
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ managers: [], employees: [], monitoringLinks: [], activityLogs: [], voiceRecordings: [] }, null, 2));
}

function readStore() {
  try {
    const raw = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return { managers: [], employees: [], monitoringLinks: [], activityLogs: [], voiceRecordings: [], ...raw };
  } catch (error) {
    throw new Error(`Local database could not be read (${dataFile}): ${error.message}`);
  }
}
function writeStore(store) {
  const temp = `${dataFile}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(store, null, 2));
  fs.renameSync(temp, dataFile);
}
const dateFields = new Set(['createdAt', 'created', 'expiresAt', 'usedAt', 'timestamp', 'startTime', 'endTime']);
function hydrate(value, key = '') {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(v => hydrate(v));
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = hydrate(v, k);
    return out;
  }
  if (dateFields.has(key) && typeof value === 'string') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return value;
}
function plain(value) {
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return { __type: 'Buffer', data: value.toString('base64') };
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = plain(v);
    return out;
  }
  return value;
}
function same(a, b) { return String(a ?? '') === String(b ?? ''); }
function matches(doc, criteria = {}) {
  return Object.entries(criteria).every(([key, expected]) => {
    const actual = doc[key];
    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if (Array.isArray(expected.$in)) return expected.$in.some(v => same(actual, v));
      return Object.entries(expected).every(([op, value]) => {
        if (op === '$in') return value.some(v => same(actual, v));
        return false;
      });
    }
    return same(actual, expected);
  });
}

class Query {
  constructor(model, criteria) { this.model = model; this.criteria = criteria; this.sortSpec = null; this.max = null; }
  sort(spec) { this.sortSpec = spec; return this; }
  limit(n) { this.max = n; return this; }
  async exec() {
    const store = readStore();
    let rows = store[this.model.collection].filter(row => matches(row, this.criteria)).map(row => new this.model(hydrate(row), false));
    if (this.sortSpec) {
      const [key, direction] = Object.entries(this.sortSpec)[0] || [];
      if (key) rows.sort((a, b) => {
        const av = a[key] instanceof Date ? a[key].getTime() : a[key];
        const bv = b[key] instanceof Date ? b[key].getTime() : b[key];
        return av < bv ? -direction : av > bv ? direction : 0;
      });
    }
    if (this.max != null) rows = rows.slice(0, this.max);
    return rows;
  }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
  catch(reject) { return this.exec().catch(reject); }
}

function makeModel(collection, defaults = {}) {
  return class LocalDocument {
    static collection = collection;
    constructor(data = {}, isNew = true) {
      Object.assign(this, JSON.parse(JSON.stringify(defaults, (k, v) => v instanceof Date ? v.toISOString() : v)));
      Object.assign(this, data);
      if (!this._id) this._id = crypto.randomBytes(12).toString('hex');
      this._isNew = isNew;
    }
    async save() {
      const store = readStore();
      const rows = store[collection];
      const index = rows.findIndex(row => same(row._id, this._id));
      const record = plain(this);
      delete record._isNew;
      if (index >= 0) rows[index] = record; else rows.push(record);
      writeStore(store);
      this._isNew = false;
      return this;
    }
    static findOne(criteria) { return new Query(this, criteria).limit(1).exec().then(rows => rows[0] || null); }
    static findById(id) { return this.findOne({ _id: id }); }
    static find(criteria = {}) { return new Query(this, criteria); }
  };
}

const Manager = makeModel('managers', { createdAt: new Date(), settings: { enableScreenshot: true, enableKeylogger: true, enableVoice: true, linkValidity: 60 } });
const Employee = makeModel('employees', { createdAt: new Date() });
const MonitoringLink = makeModel('monitoringLinks', { created: new Date(), used: false, status: 'active' });
const ActivityLog = makeModel('activityLogs', { timestamp: new Date(), createdAt: new Date() });
const VoiceRecording = makeModel('voiceRecordings', { createdAt: new Date() });

module.exports = { Manager, Employee, MonitoringLink, ActivityLog, VoiceRecording, dataFile };
