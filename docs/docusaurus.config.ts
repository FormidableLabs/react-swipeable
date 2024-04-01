import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "React Swipeable",
  tagline: "Customizable, fast, and lightweight React hook which provides all the information needed for your site to manage swipe interactions.",
  favicon: "img/nearform-icon.svg",
  url: "https://commerce.nearform.com/",
  baseUrl: "/open-source/react-swipeable",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/FormidableLabs/react-swipeable/tree/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themes:[
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
      }),
    ],
  ],
  plugins: [
    async function myPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins = [
            require('postcss-import'), 
            require('tailwindcss'), 
            require('autoprefixer')
          ];
          return postcssOptions
        },
      };
    },
  ],
  themeConfig: {
    metadata: [
     { name:"viewport", content:"width=device-width, initial-scale=1, maximum-scale=1"}
    ],
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "React Swipeable",
      logo: {
        alt: "Nearform logo",
        src: "img/nearform-logo-white.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "sidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/FormidableLabs/react-swipeable",
          "aria-label": "GitHub Repository",
          className: "header-github-link",
          position: "right",
        },
      ],
    },
    footer: {
      logo: {
        alt: "Nearform logo",
        src: "img/nearform-logo-white.svg",
        href: "https://commerce.nearform.com",
        width: 100,
        height: 100,
      },
      copyright: `Copyright © 2013-${new Date().getFullYear()} Nearform`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
