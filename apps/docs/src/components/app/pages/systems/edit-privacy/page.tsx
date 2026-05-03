import {useSystem} from "@/lib/app/use-system";
import {Spinner} from "@/components/ui/spinner";
import {DynamicPageTitle} from "@/components/app/dynamic-title";
import {motion} from "motion/react";
import {Separator} from "@/components/ui/separator";
import {PrivacySystemSettingsCard} from "@/components/app/pages/systems/privacy-system-card";

export default function EditPrivacySystemPage() {
    const {data, isLoading} = useSystem()


    if (isLoading) return <Spinner/>;

    if (data)
        return <main
            className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
            <DynamicPageTitle title="Edit Privacy • PluralBuddy App"/>
            <div className="max-md:space-y-3 items-center gap-6 w-full">

                <motion.h1
                    className="text-2xl font-bold"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween"}}
                >
                    Edit Privacy - {data?.systemName}
                </motion.h1>
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween"}}
                >
                    <Separator className="h-px my-4"/>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 100, y: 0}}
                    transition={{type: "tween", delay: 0.2}}
                >
                    <PrivacySystemSettingsCard data={data}/>
                </motion.div>
            </div>
        </main>;

    return null;
}