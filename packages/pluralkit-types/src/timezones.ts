/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import moment from 'moment-timezone';

export function allShortenedTimezones() {
    // Get all timezone names
    const timezones = moment.tz.names();
    
    // Create an object to hold the timezones and their abbreviations
    const timezoneAbbreviations: { [key: string]: string } = {};
    
    // Iterate over the timezone names and get their abbreviations
    for (const timezone of timezones) {
        const date = moment.tz(timezone);
        const abbreviation = date.format('z'); // Get abbreviated timezone name (e.g., "UTC", "PST")
        timezoneAbbreviations[timezone] = abbreviation;
    }

    return [...new Set(Object.values(timezoneAbbreviations))];
}