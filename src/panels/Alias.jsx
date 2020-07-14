import React from 'react';
import PropTypes from 'prop-types';

import Affix from '../components/common/Affix';
import RoundButton from '../components/common/RoundButton';
import HillPanel from '../components/panel/HillPanel';
import AliasRules from '../components/rules/AliasRules';

import { useModal } from '../hooks/overlay';
import { useImmutableCallback } from '../hooks/base';
import { useBus } from '../hooks/util';

const Alias = ({ id, goBack }) => {
  const bus = useBus();
  const modal = useModal();

  const openRules = useImmutableCallback(() => {
    modal.show(<AliasRules />);
  });

  const prepare = useImmutableCallback(() => {
    bus.emit('app:view', 'alias-prepare');
  });

  return (
    <HillPanel
      id={id}
      callback={goBack}
      title="Алиас"
      color="yellow"
      affix={(
        <Affix>
          <span>Описание</span>
          <RoundButton onClick={openRules}>Правила</RoundButton>
        </Affix>
      )}
      postfix={(
        <button onClick={prepare}>начать</button>
      )}
    >
      Алиас — классика настольных игр
      по объяснению слов. Каждый из
      игроков по очереди должен за
      ограниченное время объяснить
      своей команде слова, указанные
      на игровых карточках. Побеждает
      команда, которая первой наберет
      указанное в настройках количество слов
    </HillPanel>
  );
};

Alias.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Alias;