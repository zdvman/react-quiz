function Options({ question, dispatch, answer }) {
  const isAnswer = answer !== null;
  return (
    <div className='options'>
      {question.options.map((option, index) => (
        <button
          key={option}
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${
            isAnswer
              ? index === question.correctOption
                ? 'correct'
                : 'wrong'
              : ''
          }`}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
          disabled={isAnswer}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
