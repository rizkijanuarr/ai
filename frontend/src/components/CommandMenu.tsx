import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { FileText, BarChart3, Database, Home } from "lucide-react";

const searchItems = [
    {
        group: "Pages",
        items: [
            { title: "Home", href: "/", icon: Home },
            { title: "Dataset Model", href: "/dataset-model", icon: Database },
            { title: "API Docs", href: "http://localhost:5002/apidocs/#/", icon: FileText, external: true },
        ],
    },
    {
        group: "Fitur Pengujian",
        items: [
            { title: "Proses 1 - Confusion Matrix", href: "/proses-1", icon: BarChart3 },
            { title: "Proses 2 - K-Fold Cross Validation", href: "/proses-2", icon: BarChart3 },
            { title: "Proses 3 - Epoch + Early Stopping", href: "/proses-3", icon: BarChart3 },
            { title: "Proses 4 - Batch Size", href: "/proses-4", icon: BarChart3 },
            { title: "Proses 5 - Optimizer", href: "/proses-5", icon: BarChart3 },
        ],
    },
];

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="hidden lg:flex items-center relative h-8 w-56 rounded-md border border-input bg-background px-3 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
                <span className="inline-flex items-center gap-2">
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Cari..
                </span>
                <kbd className="absolute right-2 pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
                    CTRL+K
                </kbd>
            </button>

            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Cari fitur apapun disini..." />
                <CommandList>
                    <CommandEmpty>Maaf, fitur yang kamu cari tidak ditemukan.</CommandEmpty>
                    {searchItems.map((group) => (
                        <CommandGroup key={group.group} heading={group.group}>
                            {group.items.map((item: any) => {
                                const Icon = item.icon;
                                return (
                                    <CommandItem
                                        key={item.href}
                                        value={item.title}
                                        onSelect={() => {
                                            runCommand(() => {
                                                if (item.external) {
                                                    window.open(item.href, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    navigate(item.href);
                                                }
                                            });
                                        }}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span>{item.title}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
}
