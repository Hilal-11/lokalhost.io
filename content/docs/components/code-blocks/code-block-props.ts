import { PropRow } from "@/components/mdx/props-table";

export const codeBlockProps: PropRow[] = [
  { name: "code", type: "string", description: "The raw source code to display and highlight.", required: true },
  { name: "fileName", type: "string", description: "File path or name shown in the header next to the language icon." },
  { name: "language", type: "string", description: "Shiki-supported language id used for syntax highlighting (e.g. \"ts\", \"tsx\", \"bash\", \"json\")."},
  { name: "showLineNumbers", type: "boolean", description: "Toggles a line-number gutter alongside the code." },
  { name: "lightTheme", type: "string", description: "Shiki theme id used when resolved app theme is light." },
  { name: "darkTheme", type: "string", description: "Shiki theme id used when resolved app theme is dark."},
  { name: "width", type: "string | number", description: "Width of the component. Numbers are treated as pixels; strings are used as-is (e.g. \"100%\", \"40rem\")."},
  { name: "height", type: "string | number", description: "Height of the component. Numbers are treated as pixels; strings are used as-is (e.g. \"auto\", \"60vh\")."},
  { name: "borderRadius", type: "string | number", description: "Corner radius of the outer card. Numbers are treated as pixels." },
  { name: "bgColor", type: "string", description: "Background color in light mode. Falls back to the default neutral background if omitted." },
  { name: "darkBgColor", type: "string", description: "Background color in dark mode. Falls back to the default neutral background if omitted." },
  { name: "borderColor", type: "string", description: "Border color in light mode. Falls back to the default neutral border if omitted." },
  { name: "darkBorderColor", type: "string", description: "Border color in dark mode. Falls back to the default neutral border if omitted." },
  { name: "headerBgColor", type: "string", description: "Background color for the header row in light mode. Defaults to bgColor if omitted." },
  { name: "darkHeaderBgColor", type: "string", description: "Background color for the header row in dark mode. Defaults to darkBgColor if omitted." },
  { name: "className", type: "string", description: "Additional classes applied to the outer card for one-off style overrides." },
];