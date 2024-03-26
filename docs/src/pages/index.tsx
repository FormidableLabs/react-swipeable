import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import { LandingHero } from "../components/landing/landing-hero";
import { LandingFeaturedProjects } from "../components/landing/landing-featured-projects";
import Simple from "../components/examples/Simple";
import { LandingFeatures } from "../components/landing/landing-features";
import {
  feature1,
  feature2,
  feature3,
} from "../components/landing/landing-images";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className="dark:bg-gray-500 bg-gray-200 dark:text-white text-theme-2">
        <LandingHero
          heading={siteConfig.title}
          body={siteConfig.tagline}
          copyText="npm add react-swipeable"
          navItems={[
            { link: "/docs", title: "Documentation" },
            { link: "/docs/examples/simple-carousel", title: "Demo" },
            {
              link: "https://github.com/FormidableLabs/react-swipeable",
              title: "Github",
            },
          ]}
        ></LandingHero>
      </div>
      <LandingFeatures
        heading="Features"
        list={[
          {
            imgSrc: feature1,
            alt: "robust",
            title: "Robust",
            body:
              "Swipeable provides a hook with all the details you'd ever want to know about a user's swipe behavior.",
          },
          {
            imgSrc: feature2,
            alt: "flexible",
            title: "Flexible",
            body:
              "The hook is minimal, versatile and flexible. Can be attached to any HTML element, which allows for unlimited possibilities in component design.",
          },
          {
            imgSrc: feature3,
            alt: "dynamic",
            title: "Dynamic",
            body:
              "Swipeable is intended for touch interactions, but can easily handle mouse drags as well!",
          },
        ]}
      />
      <Simple showDivider />
      <LandingFeaturedProjects
        showDivider
        heading="Other Open Source from Nearform_Commerce"
        projects={[
          {
            name: "spectacle",
            link: "https://commerce.nearform.com/open-source/spectacle",
            description:
              "A React.js based library for creating sleek presentations using JSX syntax with the ability to live demo your code!",
          },
          {
            name: "figlog",
            link: "https://github.com/FormidableLabs/FigLog",
            description:
              "FigLog is the easiest and most efficient way to document team decisions and the evolution of your changes in Figma.",
            title: "FigLog",
          },
          {
            name: "envy",
            link: "https://github.com/FormidableLabs/envy",
            description:
              "Envy will trace the network calls from every application in your stack and allow you to view them in a central place.",
          },
          {
            name: "victory",
            link: "https://commerce.nearform.com/open-source/victory/",
            description:
              "React.js components for modular charting and data visualization.",
          },
        ]}
      />
    </Layout>
  );
}
