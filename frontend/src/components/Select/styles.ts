import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  clean?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 38px;
  padding: 20px 16px;
  box-shadow: 0 0 4px var(--shadow-color);
  background: var(--box-bg-color);
  display: flex;
  align-items: center;
  border-bottom: 2px solid #777;
  border-radius: 8px;
  color: var(--text-color-3);

  ${props =>
    props.clean &&
    css`
      height: auto;
      padding: 0px;
      box-shadow: none;
      background: transparent;
      border-bottom: none;
      border-radius: 8px;
    `}

  ${props =>
    props.isErrored &&
    css`
      border-color: var(--error-color);
    `}
  ${props =>
    props.isFocused &&
    css`
      color: var(--main-color);
      border-color: var(--main-color);
    `}
  ${props =>
    props.isFilled &&
    css`
      color: var(--main-color);
    `}

  &.disabled {
    border-color: #777;
    background-color: #eee;
  }

  .react-select {
    flex: 1;
    text-align: left;
    border: 0;
    color: var(--text-color-2);
    font-size: 18px;
    background: transparent;

    .react-select__menu {
      overflow-y: scroll !important;
    }
    .react-select__control {
      background: transparent;
      border-radius: 0px !important;
      border: 0px;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
      cursor: pointer;
    }
    .react-select__value-container {
      padding: 0 8px;
      overflow: hidden;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: var(--text-color-1);

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
