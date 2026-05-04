import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Field, FieldDescription, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {FullColorPicker} from "@/components/app/pages/systems/full-color-picker";
import {Button} from "@/components/ui/shadcn-button";
import {useEffect, useState} from "react";
import {db} from "@/lib/app/dexie";
import {DiscordSnowflake} from "@sapphire/snowflake";
import { parseColor } from "@react-stately/color"

export function CreateNewGroupPopover({children}: { children: React.ReactNode }) {
    const [currentName, setCurrentName] = useState('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [currentColor, setCurrentColor] = useState(parseColor("rgb(63,76,123)"))
    const [open, setOpen] = useState(false)

    // biome-ignore lint/correctness/useExhaustiveDependencies: Required
    useEffect(() => {
        setCurrentColor(parseColor("rgb(63,76,123)"));
        setCurrentName('')
        setNameError(false)
    }, [open])

    const submit = async () => {
        if (currentName.length < 1) {
            setNameError(true); return;
        }

        await db.privacyGroups.add({
            id: DiscordSnowflake.generate().toString(),
            name: currentName,
            color: currentColor.toString("hex"),
            fields: [],
            attachedUsers: [],
            permissions: {
                alter: 0,
                tag: 0,
                system: 0
            },
            system: "@me"
        })

        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <Field>
                    <FieldLabel htmlFor="name">Group Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Group Name"
                        value={currentName}
                        onChange={(e) => setCurrentName(e.target.value)}
                    />
                    <FieldDescription>What will this group be called?</FieldDescription>
                    {nameError && <FieldError>This field is required.</FieldError>}
                    {currentName.length > 100 && <FieldError>Group name is too long.</FieldError>}
                </Field>
                <Field>

                    <FieldLabel htmlFor="name">Group Color (optional)</FieldLabel>
                    <FullColorPicker color={currentColor} setColor={setCurrentColor} />
                </Field>
                <Button onClick={submit}>Submit</Button>
            </PopoverContent>
        </Popover>
    );
}