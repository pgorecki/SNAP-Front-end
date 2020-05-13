export function formatOwner(owner) {
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

export function clientFullName(client) {
  if (!client) {
    return undefined;
  }
  const parts = [
    client.first_name,
    client.middle_name,
    client.last_name,
  ].filter((x) => !!x);
  return parts.join(' ').trim();
}
