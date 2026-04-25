import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
	class Improvement extends Model {}
	
	Improvement.init({
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
		sequelize,
		modelName: 'Improvement',
		tableName: 'improvements',
		timestamps: true,
	});
	
	return Improvement;
};