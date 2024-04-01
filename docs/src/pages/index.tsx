import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import { LandingHero } from "../components/landing/landing-hero";
import { LandingBanner } from "../components/landing/landing-banner";
import { LandingFeaturedProjects } from "../components/landing/landing-featured-projects";
import { LandingFeatures } from "../components/landing/landing-features";
import SwipeDemo from "../components/examples/SwipeDemo";
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
            { link: "/open-source/react-swipeable/docs", title: "Documentation" },
            { link: "/open-source/react-swipeable/docs/examples/simple-carousel", title: "Demo" },
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
            html: {
              __html:
                "The <code>useSwipeable</code> hook provides you with all the information you need to know about a user's swipe behavior.",
            },
          },
          {
            imgSrc: feature2,
            alt: "flexible",
            title: "Flexible",
            html: {
              __html:
                "<code>useSwipeable</code> is minimal, versatile and flexible. It can be attached to any HTML element, which allows for unlimited possibilities in component design.",
            },
          },
          {
            imgSrc: feature3,
            alt: "powered by react",
            title: "Powered by React",
            body:
              "Swipeable leverages the power of React's declarative and component-based architecture for immersive swipe interactions.",
          },
        ]}
      />
      <SwipeDemo showDivider />
      <LandingBanner
        showDivider
        heading="Get Started"
        body="Implement a robust, flexible and dynamic Swipeable component today!"
        cta={{ link: "/open-source/react-swipeable/docs", text: "Documentation" }}
      />
      <LandingFeaturedProjects
        heading="Other Open Source from Nearform_Commerce"
        projects={[
          {
            name: "nuka",
            link: "https://github.com/FormidableLabs/nuka-carousel", // todo: update with docs site once one exists
            description:
              "Small, fast and accessibility-first React carousel library with easily customizable UI and behavior to fit your brand and site.",
          },
          {
            name: "spectacle",
            link: "https://commerce.nearform.com/open-source/spectacle",
            description:
              "A React.js based library for creating sleek presentations using JSX syntax with the ability to live demo your code!",
          },
          {
            name: "envy",
            link: "https://github.com/FormidableLabs/envy", // todo: update with docs site once one exists
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
