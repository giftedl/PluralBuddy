/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { tagColors } from "@/types/tag"

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
        loading: "<a:loading:1433658260338114570>",
        catjamming: "<a:catjamming:1437185438036132022>",
        github: "<:github:1437190309413912757>",
        book: "<:book:1437190307665018941>",
        lineIn: "<:linein:1437194209248546968>",
        lineRight: "<:lineright:1437194208061685830>",
        reply: "<:reply:1437573940393545911>",
        plus: "<:plus:1440154372687265932>",
        refresh: "<:refreshccw:1440902320018690301>",
        tag0: "<:tag0:1441277056611520572>",
        tag1: "<:tag1:1441277057681195088>",
        tag2: "<:tag2:1441277058767655004>",
        tag3: "<:tag3:1441277059857907752>",
        tag4: "<:tag4:1441277060856283186>",
        tag5: "<:tag5:1441277062798114886>",
        tag6: "<:tag6:1441277064312389732>",
        tag7: "<:tag7:1441277065713291346>",
        tag8: "<:tag8:1441277066950606949>",
        tag9: "<:tag9:1441277068720476190>",
        tag10: "<:tag10:1441277069689360445>",
        tag11: "<:tag11:1441277070654177350>",
        tag12: "<:tag12:1441277071597768734>",
        tag13: "<:tag13:1441277073091199127>",
        tag14: "<:tag14:1441277073900703754>",
        tag15: "<:tag15:1441277074919788774>",
        tag16: "<:tag16:1441277076177948713>",
        minus: "<:minus:1446751279782166639>",
        search: "<:search:1446899346514641191>"
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
        circleQuestion: "<:circlequestionmark:1436973265900929156>",
        circleQuestionWhite: "<:circlequestionmarkwhite:1436973264202371172>",
        check: "<:check:1436973262310608936>",
        loading: "<a:loading:1436974818422427738>",
        catjamming: "<a:catjamming:1437185292170690640>",
        github: "<:github:1437190484635291709>",
        book: "<:book:1437190483725123787>",
        lineIn: "<:linein:1437193987592159282>",
        lineRight: "<:lineright:1437193986400981112>",
        reply: "<:reply:1437573788245037186>",
        plus: "<:plus:1440154214964789300>",
        refresh: "<:refreshccw:1440899053293535313>",
        tag0: "<:tag0:1441276966929174668>",
        tag1: "<:tag1:1441276967935545525>",
        tag2: "<:tag2:1441276969227522202>",
        tag3: "<:tag3:1441276970250797166>",
        tag4: "<:tag4:1441276971412750386>",
        tag5: "<:tag5:1441276972394221694>",
        tag6: "<:tag6:1441276973354582128>",
        tag7: "<:tag7:1441276974374064128>",
        tag8: "<:tag8:1441276975573373049>",
        tag9: "<:tag9:1441276976928391188>",
        tag10: "<:tag10:1441276978018914456>",
        tag11: "<:tag11:1441276978677157900>",
        tag12: "<:tag12:1441276980208336966>",
        tag13: "<:tag13:1441276980862648372>",
        tag14: "<:tag14:1441276982137720893>",
        tag15: "<:tag15:1441276983295082677>",
        tag16: "<:tag16:1441276984754700318>",
        minus: "<:minus:1446751239701532833>",
        search: "<:search:1446899250595106887>"
    }
}

export const emojis = emojiProfiles[process.env.EMOJI_PROFILE as "production" | "canary" ?? "canary"]

export function getEmojiFromTagColor(tagColor: string) {
    switch(tagColor) {
        case "red":
            return emojis.tag0
        case "orange":
            return emojis.tag1
        case "amber":
            return emojis.tag2
        case "yellow":
            return emojis.tag3
        case "lime":
            return emojis.tag4
        case "green":
            return emojis.tag5
        case "emerald":
            return emojis.tag6
        case "teal":
            return emojis.tag7
        case "cyan":
            return emojis.tag8
        case "sky":
            return emojis.tag9
        case "blue":
            return emojis.tag10
        case "indigo":
            return emojis.tag11
        case "violet":
            return emojis.tag12
        case "purple":
            return emojis.tag13
        case "fuchsia":
            return emojis.tag14
        case "pink":
            return emojis.tag15
        case "rose":
            return emojis.tag16
    }

    return emojis.tag0
}