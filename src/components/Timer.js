import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const mins = String(Math.floor(secondsRemaining / 60));
  const secs = String(secondsRemaining % 60);
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);
  return (
    <div className='timer'>
      {mins.padStart(2, '0')}:{secs.padStart(2, '0')}
    </div>
  );
}

export default Timer;
