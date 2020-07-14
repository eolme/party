import styled from 'styled-components/macro';

import { Tabs as NativeTabs } from '@vkontakte/vkui';

const Tabs = styled(NativeTabs).attrs(() => ({
  mode: 'buttons'
}))`
  &,
  .TabsItem {
    color: #fff;
    background: transparent;
  }

  .TabsItem--selected {
    color: #FFA000;
    background: #fff;
  }
`;

export default Tabs;
