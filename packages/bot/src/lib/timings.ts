import { client } from "..";

const timingMap: Record<string, Date> = {

}

export function startTimer(key: string) {
    timingMap[key] = new Date();
}

export function endTimer(key: string) {
    client.logger.debug("Timings: {key} done in {time}ms", {
        key,
        time: new Date().getTime() - (timingMap[key]?.getTime() ?? Date.now())
    })

    delete timingMap[key]
}

