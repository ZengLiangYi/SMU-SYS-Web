import type { DropdownProps } from 'antd';
import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import cx from 'classnames';
import React from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    dropdown: {
      [`@media screen and (max-width: ${token.screenXS}px)`]: {
        width: '100%',
      },
    },
  };
});

export type HeaderDropdownProps = {
  popupClassName?: string;
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter';
} & Omit<DropdownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  popupClassName: cls,
  ...restProps
}) => {
  const { styles } = useStyles();
  return (
    <Dropdown classNames={{ root: cx(styles.dropdown, cls) }} {...restProps} />
  );
};

export default HeaderDropdown;
