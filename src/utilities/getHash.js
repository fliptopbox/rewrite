const getHash = arg1 => {
  if (!arg1 || !arg1.trim()) return null;
  const match = arg1.match(/(#.*)$/);
  const value = match && match[0].slice(1);
  return (value && value) || null;
};

export default getHash;
