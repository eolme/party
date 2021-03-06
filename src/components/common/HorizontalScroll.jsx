import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { usePlatform} from '@vkontakte/vkui';

const HorizontalScrollContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const UnifiedHorizontalScroll = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;

  margin-right: -16px;

  & > * {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    min-width: 0;
  }

  &.UnifiedHorizontalScroll--ios {
    & > * {
      margin-right: 12px;
    }
  }

  &.UnifiedHorizontalScroll--android {
    & > * {
      margin-right: 16px;
    }
  }
`;

const HorizontalScroll = (props) => {
  const platform = usePlatform();

  return (
    <HorizontalScrollContainer className={`${props.className} HorizontalScroll--${platform} scrollable`}>
      <UnifiedHorizontalScroll className={`UnifiedHorizontalScroll--${platform}`}>
        {props.children}
      </UnifiedHorizontalScroll>
    </HorizontalScrollContainer>
  );
};

HorizontalScroll.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default HorizontalScroll;
