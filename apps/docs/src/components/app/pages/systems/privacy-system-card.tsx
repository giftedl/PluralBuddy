import type {PSystem} from "plurography";
import {motion} from "motion/react";
import {Card, CardContent, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useMemo, useState} from "react";
import {db} from "@/lib/app/dexie";
import {Button} from "@/components/ui/shadcn-button";

const flags = [
    {
        name: "Name",
        value: 1 << 0,
        desc: "Allows other users to see your system name."
    },
    {
        name: "Display Tag",
        value: 1 << 1,
        desc: "Allows other users to see your system display tag."
    }, {
        name: "Description",
        value: 1 << 2,
        desc: "Allows other users to see your system description."
    }, {
        name: "Avatar",
        value: 1 << 3,
        desc: "Allows other users to see your system avatar."
    }, {
        name: "Banner",
        value: 1 << 4,
        desc: "Allows other users to see your system banner."
    }, {
        name: "Pronouns",
        value: 1 << 5,
        desc: "Allows other users to see your system pronouns."
    }, {
        name: "Alters",
        value: 1 << 6,
        desc: "Allows other users to see your system alters."
    }, {
        name: "Tags",
        value: 1 << 7,
        desc: "Allows other users to see your system tags."
    }
]

export function PrivacySystemSettingsCard({data}: { data: PSystem }) {

    const [values, setValues] = useState<{ name: string,value: string }[]>(flags.map(v => ({name: v.name, value: data.public & v.value ? "public" : "private"})))

    const reload = async (values: { name: string, value: string }[]) => {
        let num = 0;
        for (const flag of flags) {
            num |= values.find((c) => c.name === flag.name)?.value === "public" ? flag.value : 0;
        }

        await db.systems.update("@me", {
            public: num
        })
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: ...
    useEffect(() => {reload(values)}, [values])

    return (
        <Card className="mb-3">
            <CardContent>
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween", delay: 0.2}}
                >
                    <CardTitle>System Privacy</CardTitle>
                    <CardDescription>
                        Configure how others can see and use your system. By default, all system data is private. <strong>This doesn't impact your alter's individual privacy settings.</strong>
                    </CardDescription>
                </motion.div>
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween", delay: 0.4}}
                    className="grid grid-cols-2 gap-6 mt-4"
                >{flags.map((flag, i) => <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween", delay: (0.4 + (i * 0.1))}} key={flag.name}><Field
                    className="flex! justify-between flex-row! items-center">

                    <div className="block">
                        <FieldLabel>{flag.name}</FieldLabel>
                        <FieldDescription>
                            {flag.desc}
                        </FieldDescription></div>
                    <Select value={values.find(c => c.name === flag.name)?.value} onValueChange={(v) => setValues(i => [...i.filter(c => c.name !== flag.name), { name: flag.name, value: v }])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Public or private?"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                </motion.div>)}
                </motion.div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={async () => {
                    await db.systems.update("@me", {
                        public: 0
                    })

                    setValues(flags.map(v => ({name: v.name, value: "private"})));
                }}>Reset</Button>
            </CardFooter>
        </Card>
    )

}