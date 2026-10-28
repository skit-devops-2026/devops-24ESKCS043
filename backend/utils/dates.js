'use strict';

// The latest calendar date that is "today" anywhere on Earth (UTC+14).
// Used so a purchase made today in any timezone is accepted, while
// genuinely future dates are rejected.
function latestValidToday() {
  return new Date(Date.now() + 14 * 3600 * 1000).toISOString().split('T')[0];
}

function isValidDateString(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
}

module.exports = { latestValidToday, isValidDateString };
