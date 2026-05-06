"use client"

import { parseColor } from "@react-stately/color"
import { useState } from "react"
import { Button } from "@/components/ui/shadcn-button"
import { ColorArea } from "@/components/ui/color-area"
import { ColorField } from "@/components/ui/color-field"
import { ColorPicker } from "@/components/ui/color-picker"
import { ColorSlider, ColorSliderTrack } from "@/components/ui/color-slider"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { ColorThumb } from "@/components/ui/color-thumb"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Input} from "@/components/ui/intent-input";
import {Color} from "react-aria-components";

export function FullColorPicker({color, setColor}: {color: Color, setColor: (color: Color) => void}) {
    return (
        <ColorPicker value={color} onChange={setColor} defaultValue="rgb(120,140,200)" className="max-w-min">
            <Popover>
                <PopoverTrigger asChild>
                <Button variant="ghost" data-slot="control" className="w-full">
                    <ColorSwatch className="max-w-5 max-h-5"/>
                    Select color
                </Button></PopoverTrigger>
                <PopoverContent className="[--gutter:--spacing(1)] w-min">
                        <div className="space-y-(--gutter)">
                            <ColorArea
                                colorSpace="rgb"
                                defaultValue="rgb(120,140,200)"
                                xChannel="red"
                                yChannel="green"
                                xName="red"
                                yName="green"
                            />
                            <ColorSlider colorSpace="hsb" channel="hue" className="max-w-56">
                                <ColorSliderTrack>
                                    <ColorThumb />
                                </ColorSliderTrack>
                            </ColorSlider>
                            <ColorField aria-label="Color">
                                <Input className="max-w-56" onChange={(e) => {

                                    if (e.target.value.length === 7) setColor(parseColor(e.target.value))
                                }} />
                            </ColorField>
                        </div>
                </PopoverContent>
            </Popover>
        </ColorPicker>
    )
}
