import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
	class Tag extends Model {}

	Tag.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		displayValue: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'Tag',
		tableName: 'tags',
		timestamps: true,
	});

	return Tag;
};

