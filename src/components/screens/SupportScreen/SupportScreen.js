import React from 'react';
import styled from 'styled-components';

import PageLayout from './../../layout/PageLayout';
import PageTitle from './../../layout/PageTitle';
import Feature from './../../layout/Feature';
import FeaturesLayout from './../../layout/FeaturesLayout';

import { Icon, Link, styles } from './../../basics';

const { breakpoint } = styles;

const Features = styled(FeaturesLayout)`
  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 7rem;
  }
`;

export default function SupportScreen({ ...props }) {
  return (
    <PageLayout {...props}>
      <PageTitle
        heading="Support"
        title="We’re happy to help"
        desc="Storybook’s thriving community can help answer your questions. Developers of all skill levels welcome."
        color="purple"
      />
      <Features columns={3}>
        <Feature
          image={<img src="images/colored-icons/repo.svg" />}
          title="Check the docs"
          desc="First check the Storybook docs. There’s likely an article for your issue already."
        >
          <Link withArrow>
            Read docs
            <Icon icon="arrowright" />
          </Link>
        </Feature>
        <Feature
          image={<img src="images/logos/social/github.svg" />}
          title="File an issue on GitHub"
          desc="If you encounter an issue, do us a favor and report it. Someone else may have the same issue."
        >
          <Link withArrow>
            View GitHub issues
            <Icon icon="arrowright" />
          </Link>
        </Feature>
        <Feature
          image={<img src="images/logos/social/discord.svg" />}
          title="Ask a question in chat"
          desc="Get help over chat from community members. A maintainer is usually online."
        >
          <Link withArrow>
            Chat now
            <Icon icon="arrowright" />
          </Link>
        </Feature>
      </Features>
    </PageLayout>
  );
}
