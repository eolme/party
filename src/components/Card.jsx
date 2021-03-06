import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import Clickable from './common/Clickable';
import IconUsers from '@vkontakte/icons/dist/36/users_3_outline';
import IconTime from '@vkontakte/icons/dist/28/recent_outline';

import { useCompute } from '../hooks/base';

const ShadowTheme = {
  yellow: css`background-color: #FF973B;`,
  blue: css`background-color: #00A3FF;`,
  green: css`background-color: #1EDC30;`,
  gray: css`background-color: #616161;`,
  pink: css`background-color: #FF8197;`
};

const BackgroundTheme = {
  yellow: css`background-image: linear-gradient(158deg, #FFCC4E 12%, #FFA54F 80%);`,
  blue: css`background-image: linear-gradient(158deg, #46D8F5 12%, #4FBCFA 80%);`,
  green: css`background-image: linear-gradient(158deg, #38EDB1 12%, #28D984 80%);`,
  gray: css`background-image: linear-gradient(158deg, #939393 12%, #616161 80%);`,
  pink: css`background-image: linear-gradient(158deg, #FFC3A0 12%, #FF8197 80%);`
};

const CardShadow = styled.div`
  border-radius: 20px;

  overflow: hidden;

  width: 260px;
  height: 244px;

  color: #fff;

  ${(props) => ShadowTheme[props.$color]}
`;

const CardContainer = styled.button`
  border-radius: 0 0 20px 20px;

  padding: 24px;
  box-sizing: border-box;

  overflow: hidden;
  position: relative;

  width: 260px;
  height: 240px;

  ${(props) => BackgroundTheme[props.$color]}
`;

const CardButton = styled.button`
  width: 100%;
  height: 60px;

  font-size: 24px;
  line-height: 60px;

  color: #fff;
  background-color: rgba(255, 255, 255, 0.3);

  border: none;
  outline: none;

  position: absolute;
  left: 0;
  bottom: 0;
`;

const CardName = styled.div`
  font-size: 24px;
  line-height: 32px;

  color: rgba(0, 0, 0, 0.7);

  margin-bottom: 4px;
`;

const CardDescription = styled.div`
  white-space: ${(props) => props.$nowrap ? 'nowrap' : 'normal'};

  font-size: 16px;
  line-height: 20px;
  margin-bottom: 24px;
`;

const CardInfo = styled.div`
  white-space: nowrap;
  margin-right: -16px;
`;

const CardInfoBadge = styled.span`
  display: inline-block;
  white-space: nowrap;

  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;

  padding: 18px 14px;

  font-size: 16px;
  line-height: 16px;
  font-weight: 500;

  margin-right: 16px;

  .Icon {
    display: inline-block;
    vertical-align: bottom;

    width: 24px;
    height: 24px;

    margin: -4px 0 -4px 8px;
  }
`;

const Card = (props) => {
  const showInfo = useCompute(() => {
    return props.count || props.time;
  });

  return (
    <CardShadow $color={props.color}>
      <CardContainer
        as={Clickable}
        onClick={props.callback}
        $color={props.color}
      >
        <CardName>{props.name}</CardName>
        <CardDescription $nowrap={showInfo}>
          {props.description}
        </CardDescription>
        {
          showInfo && (
            <CardInfo>
              {
                props.count && (
                  <CardInfoBadge>
                    {props.count}
                    <IconUsers width={24} height={24} />
                  </CardInfoBadge>
                )
              }
              {
                props.time && (
                  <CardInfoBadge>
                    {props.time}
                    <IconTime width={24} height={24} />
                  </CardInfoBadge>
                )
              }
            </CardInfo>
          )
        }
        <CardButton
          as={Clickable}
          onClick={props.callback}
          component="button"
        >{props.action}</CardButton>
      </CardContainer>
    </CardShadow>
  );
};

Card.propTypes = {
  color: PropTypes.oneOf(['yellow', 'blue', 'green', 'gray']).isRequired,
  name: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  count: PropTypes.node,
  time: PropTypes.node,
  action: PropTypes.string.isRequired,
  callback: PropTypes.func
};

export default Card;
