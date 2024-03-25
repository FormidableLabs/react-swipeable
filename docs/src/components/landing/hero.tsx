import React from "react";
import { ProjectBadge } from "formidable-oss-badges";

export default function Hero(): JSX.Element {
  return (
    <div>
      <ProjectBadge
        color="#5ABDEE"
        abbreviation="Rs"
        description="React Swipeable"
      />
    </div>
  );
}
