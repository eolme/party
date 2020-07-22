import React from 'react';
import PropTypes from 'prop-types';

const Timer = ({ seconds, minutes, completed }) => {
  if (completed) {
    return (
      <div className="Timer">00:00</div>
    );
  } else {
    return (
      <div className="Timer">
        {`${minutes}`.padStart(2, '0')}
        :
        {`${seconds}`.padStart(2, '0')}
      </div>
    );
  }
};

Timer.propTypes = {
  seconds: PropTypes.number,
  minutes: PropTypes.number,
  completed: PropTypes.bool
};

export default Timer;
