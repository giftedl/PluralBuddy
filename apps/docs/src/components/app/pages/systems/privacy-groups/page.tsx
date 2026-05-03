import {useSystem} from "@/lib/app/use-system";
import {Spinner} from "@/components/ui/spinner";
import {DynamicPageTitle} from "@/components/app/dynamic-title";

export function PrivacyGroupsSettingsAppPage() {

    const {data, isLoading} = useSystem()

    if (isLoading) return <Spinner/>;

    if (data)
        return (
            <main
                className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
                <DynamicPageTitle title="Privacy Groups • PluralBuddy App"/>
                <div className="max-md:space-y-3 items-center gap-6 w-full">
                </div>
            </main>
        )

    return null;
}