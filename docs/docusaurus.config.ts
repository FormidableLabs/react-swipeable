import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Swipeable',
  tagline: 'Documentation Site',
  favicon: 'img/nearform-icon.svg', //todo: update

  // Set the production url of your site here
  url: 'https://commerce.nearform.com/',

  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/FormidableLabs/react-swipeable/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom2.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    docs: {
      sidebar: {
        hideable: true
      }
    },
    navbar: {
      title: 'React Swipeable',
      logo: {
        alt: 'Nearform logo',
        src: 'img/nearform-logo-white.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'sidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/FormidableLabs/react-swipeable',
          'aria-label': 'GitHub Repository',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
        logo: {
          alt: 'Nearform logo',
          src: 'img/nearform-logo-white.svg',
          href: 'https://nearform.com',
          width: 100,
          height: 100,
        },
        copyright: `© ${new Date().getFullYear()} Nearform`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
