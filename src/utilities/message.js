const messages = {
  confirmDelete: `
You are unlocking this paragraph. 

This will delete the working versions and destill 
the paragraph to the currently elected candidate.

[CANCEL] to keep working versions
[OK] to discard versions
`
};

export default function(key) {
  return messages[key] || `WARNING:\n\nCan't find [${key}] message.`;
}
