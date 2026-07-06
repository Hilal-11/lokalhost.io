import type { Registry } from "./schema";

export const component: Registry = [
    {
        name: "download-button",
        type: "registry:component",
        dependencies: [],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/buttons/download-button.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "code-preview-block",
        type: "registry:component",
        dependencies: [],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/code-blocks/component-preview.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "code-preview-block",
        type: "registry:component",
        dependencies: [],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/code-blocks/code-block.tsx",
                type: "registry:component",
            },
        ],
    },
];