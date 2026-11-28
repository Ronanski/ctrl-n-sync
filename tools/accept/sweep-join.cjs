#!/usr/bin/env node
/* Joins the sweep samples of the two part1.cjs segments (STOP_AT=90 = 150 -> 90, FROM=sp90.json = 90 -> 45) into one file for
   tools/model/sweep-judge.cjs. Usage: node tools/accept/sweep-join.cjs <a.json> <b.json> <out.json> */
'use strict';
const fs = require('fs');
const [a, b, o] = process.argv.slice(2);
if (!o) { console.error('usage: sweep-join.cjs <a.json> <b.json> <out.json>'); process.exit(2); }
const A = JSON.parse(fs.readFileSync(a, 'utf8')), B = JSON.parse(fs.readFileSync(b, 'utf8'));
A.SW = A.SW.concat(B.SW);
fs.writeFileSync(o, JSON.stringify(A));
console.log('joined', A.SW.length, 'samples');
