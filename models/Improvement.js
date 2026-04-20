export default (sequelize, DataTypes) => {
  const Improvement = sequelize.define('Improvement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'improvements',
    timestamps: true,
  });

  return Improvement;
};

