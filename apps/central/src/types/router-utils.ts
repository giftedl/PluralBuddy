import { useNavigate } from "@tanstack/react-router"

export type AnyValidPathname = Parameters<ReturnType<typeof useNavigate>>[0]["from"]