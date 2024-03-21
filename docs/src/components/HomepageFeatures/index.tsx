import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Hero from "../landing/hero";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Todo",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: <>Todo</>,
  },
  {
    title: "Todo",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <>Todo</>,
  },
  {
    title: "Powered by React",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: <>Extend or customize your website layout by reusing React.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <Hero />
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}