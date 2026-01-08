// =============================================
// NeuroBreath – 4-7-8 Breathing Technique
// React Single-Page Application
// =============================================

const { useState, useEffect, useRef, useCallback } = React;

// =============================================
// STATS MODULE (from app.js)
// =============================================
function createStatsModule(){
    const KEY = 'mpl.stats.v1';
    const TZ = 'Europe/London';
    const defaultState = { version:1, timezone:TZ, sessions:0, totalSeconds:0, totalBreaths:0, lastSession:null, dayStreak:0, history:{} };
    const dayFormatter = (()=>{
        try{ return new Intl.DateTimeFormat('en-CA',{ timeZone:TZ }); }
        catch{ return { format(date){ const d = date instanceof Date ? date : new Date(date); if (Number.isNaN(d.getTime())) return ''; const y = d.getUTCFullYear(); const m = String(d.getUTCMonth()+1).padStart(2,'0'); const day = String(d.getUTCDate()).padStart(2,'0'); return `${y}-${m}-${day}`; } }; }
    })();
    let state = load();

    function load(){
        try{
            const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (!raw || typeof raw !== 'object') throw new Error('Invalid stats');
            raw.history = raw.history && typeof raw.history === 'object' ? raw.history : {};
            return Object.assign({}, defaultState, raw);
        }catch{
            return JSON.parse(JSON.stringify(defaultState));
        }
    }
    function save(){
        try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch{}
    }
    function toDayKey(value){
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return dayFormatter.format(new Date());
        return dayFormatter.format(date);
    }
    function prevDayKey(key){
        const parts = key.split('-').map(Number);
        if (parts.length !== 3 || parts.some(n=>Number.isNaN(n))) return key;
        const dt = new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
        dt.setUTCDate(dt.getUTCDate()-1);
        return dayFormatter.format(dt);
    }
    function computeStreak(history, anchorKey){
        const keys = Object.keys(history || {}).filter(k => (history[k]?.sessions || 0) > 0).sort();
        if (!keys.length) return 0;
        let streak = 0;
        let cursor = anchorKey || keys[keys.length - 1];
        const visited = new Set();
        while (cursor && history[cursor] && (history[cursor].sessions || 0) > 0){
            if (visited.has(cursor)) break;
            visited.add(cursor);
            streak += 1;
            const next = prevDayKey(cursor);
            if (next === cursor) break;
            cursor = next;
        }
        return streak;
    }
    function addSession(payload = {}){
        const ts = payload.timestamp ? new Date(payload.timestamp) : new Date();
        if (Number.isNaN(ts.getTime())) return get();
        const seconds = Math.max(0, Number(payload.seconds) || 0);
        const breaths = Math.max(0, Number(payload.breaths) || 0);
        const techId = typeof payload.techId === 'string' ? payload.techId.trim() : '';
        const pageId = typeof payload.pageId === 'string' ? payload.pageId.trim().toLowerCase() : '';
        const dayKey = toDayKey(ts);

        state.sessions = (state.sessions || 0) + 1;
        state.totalSeconds = (state.totalSeconds || 0) + seconds;
        state.totalBreaths = (state.totalBreaths || 0) + breaths;
        state.lastSession = ts.toISOString();

        const history = state.history = state.history && typeof state.history === 'object' ? state.history : {};
        const day = history[dayKey] = history[dayKey] || { seconds:0, breaths:0, sessions:0, techs:{}, firstRecordedAt:null, updatedAt:null };
        day.seconds = (day.seconds || 0) + seconds;
        day.breaths = (day.breaths || 0) + breaths;
        day.sessions = (day.sessions || 0) + 1;
        if (techId) day.techs[techId] = (day.techs[techId] || 0) + 1;
        if (!day.firstRecordedAt) day.firstRecordedAt = ts.toISOString();
        day.updatedAt = ts.toISOString();

        state.dayStreak = computeStreak(history, dayKey);
        save();
        return get();
    }
    function get(){
        return {
            sessions: state.sessions || 0,
            totalSeconds: state.totalSeconds || 0,
            totalBreaths: state.totalBreaths || 0,
            totalMinutes: Math.floor((state.totalSeconds || 0) / 60),
            lastSession: state.lastSession,
            dayStreak: state.dayStreak || 0,
            history: state.history || {}
        };
    }
    function reset(){
        try{
            state = JSON.parse(JSON.stringify(defaultState));
            save();
            return get();
        }catch{
            return get();
        }
    }

    return { addSession, get, reset };
}

const Stats = createStatsModule();
window.__MSHARE__ = window.__MSHARE__ || {};
window.__MSHARE__.Stats = Stats;

// =============================================
// CONSTANTS
// =============================================
const CIRC = 264; // Circumference for radius 42: 2 * π * 42 ≈ 263.89
const CIRC_SESSION = 283; // Circumference for radius 45: 2 * π * 45 ≈ 282.74
const TECH_ID = '478';
const PAGE_ID = '4-7-8-breathing';

// =============================================
// UTILITY FUNCTIONS
// =============================================
function normalizeMinutes(value){
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return null;
    return Math.max(1, Math.round(number));
}

function getUrlParam(name, defaultValue = null){
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || defaultValue;
}

// =============================================
// AUDIO & TTS UTILITIES
// =============================================
