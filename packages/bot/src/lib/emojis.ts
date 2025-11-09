/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

export const emojiProfiles = {
    canary: {
        x: "<:x_:1435094265758875769>",
        xWhite: "<:xwhite:1435094264638996601>",
        wrenchWhite: "<:wrenchwhite:1435094263032451202>",
        undo: "<:undo:1435094261757382789>",
        squareDashed: "<:squaredashed:1435094260184514670>",
        squareCheck: "<:squarecheck:1435094259224023071>",
        settings: "<:settings:1435094257986703522>",
        settingsWhite: "<:settingswhite:1435094256904831047>",
        redo: "<:redo2:1435094256044998801>",
        folderKeyWhite: "<:folderkeywhite:1435094254216024074>",
        discord: "<:Discord:1435094253125632030>",
        clock: "<:Clock:1435094252060278784>",
        clockCheck: "<:clockcheck:1435094251250778145>",
        circleQuestion: "<:circlequestionmark:1435094250374172754>",
        circleQuestionWhite: "<:circlequestionmarkwhite:1435094249296232612>",
        check: "<:check:1435094247769374731>",
        loading: "<a:loading:1433658260338114570>"
    },
    production: {
        x: "<:x_:1436973282304725083>",
        xWhite: "<:xwhite:1436973281084313681>",
        wrenchWhite: "<:wrenchwhite:1436973279700062240>",
        undo: "<:undo:1436973278257217597>",
        squareDashed: "<:squaredashed:1436973276470710313>",
        squareCheck: "<:squarecheck:1436973275497365595>",
        settings: "<:settings:1436973274553651272>",
        settingsWhite: "<:settingswhite:1436973273626837044>",
        redo: "<:redo2:1436973271617896579>",
        folderKeyWhite: "<:folderkeywhite:1436973270090911804>",
        discord: "<:Discord:1436973269030015047>",
        clock: "<:Clock:1436973267587170464>",
        clockCheck: "<:clockcheck:1436973266651844642>",
        circleQuestionMark: "<:circlequestionmark:1436973265900929156>",
        circleQuestionWhite: "<:circlequestionmarkwhite:1436973264202371172>",
        check: "<:check:1436973262310608936>",
        loading: "<a:loading:1436974818422427738>"
    }
}

export const emojis = emojiProfiles[process.env.EMOJI_PROFILE as "production" | "canary" ?? "canary"]