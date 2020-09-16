import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Header, Label } from 'semantic-ui-react';

export function PrimaryActionLink({ icon, label, to, ...props }) {
  return (
    <Button size="tiny" basic color="blue" as={NavLink} to={to} {...props}>
      <Icon name="edit" /> {label}
    </Button>
  );
}

export function EditActionLink({ to, ...props }) {
  return <PrimaryActionLink icon="edit" label="Edit" to={to} {...props} />;
}

export function DeleteActionButton({ onClick, ...props }) {
  return (
    <Button size="tiny" negative onClick={onClick} {...props}>
      <Icon name="trash" /> Delete
    </Button>
  );
}

export function EndActionButton({ onClick, ...props }) {
  return (
    <Button size="tiny" negative onClick={onClick} {...props}>
      <Icon name="close" /> End
    </Button>
  );
}

export function EditActionButton({ onClick, ...props }) {
  return (
    <Button size="tiny" onClick={onClick} {...props}>
      <Icon name="edit" /> Edit
    </Button>
  );
}
