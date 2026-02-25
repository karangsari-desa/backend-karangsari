export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'VARCHAR(255)',
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};
