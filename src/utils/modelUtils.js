export function formatOwner(owner) {
  console.log(owner);
  return (
    [owner.first_name, owner.last_name]
      .map((x) => x.trim())
      .filter((x) => !!x)
      .join(' ') || `no name (#${owner.id})`
  );
}
