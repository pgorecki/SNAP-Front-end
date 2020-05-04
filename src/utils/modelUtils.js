export function formatOwner(owner) {
  console.log(owner);
  return (
    [owner.first_name, owner.last_name]
      .map((x) => x.trim())
      .filter((x) => !!x)
      .join(' ') || `no name (#${owner.id})`
  );
}

export function fullName(user) {
  if (!user) {
    return undefined;
  }
  const parts = [];
  if (user.firstName) {
    parts.push(user.firstName);
  }
  if (user.middleName) {
    parts.push(user.middleName);
  }
  if (user.lastName) {
    parts.push(user.lastName);
  }
  return parts.join(' ').trim();
}
