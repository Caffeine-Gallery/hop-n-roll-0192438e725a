export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addHighScore' : IDL.Func([IDL.Int], [], []),
    'getHighScores' : IDL.Func([], [IDL.Vec(IDL.Int)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
